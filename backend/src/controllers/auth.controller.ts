import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { createHash, randomBytes, randomUUID } from 'crypto';
import supabase from '../lib/supabase';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

const resetPasswordSchema = z
  .object({
    token: z.string().min(10, 'Token inválido').optional(),
    accessToken: z.string().min(20, 'Token de acesso inválido').optional(),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  })
  .refine(data => !!data.token || !!data.accessToken, {
    message: 'Token inválido',
    path: ['token'],
  });

const ensureSupabaseAuthUser = async (email: string, name?: string) => {
  const randomPassword = randomBytes(20).toString('hex');
  const { error } = await supabase.auth.admin.createUser({
    email,
    password: randomPassword,
    email_confirm: true,
    user_metadata: name ? { name } : undefined,
  });

  if (error && !error.message.toLowerCase().includes('already') && !error.message.toLowerCase().includes('exists')) {
    throw error;
  }
};

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = registerSchema.parse(req.body);

      const { data: existingUser } = await supabase
        .from('users').select('id').eq('email', email).maybeSingle();

      if (existingUser) return res.status(400).json({ error: 'Usuário já existe' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const now = new Date().toISOString();

      const { data: user, error } = await supabase
        .from('users')
        .insert({ id: randomUUID(), name, email, password: hashedPassword, updatedAt: now })
        .select('id, name, email, isAdmin, createdAt')
        .single();

      if (error || !user) {
        console.error('Supabase insert error:', JSON.stringify(error));
        return res.status(500).json({ error: 'Erro ao criar usuário' });
      }

      try {
        await ensureSupabaseAuthUser(user.email, user.name);
      } catch (authError) {
        console.error('Erro ao sincronizar usuário no Supabase Auth:', authError);
      }

      const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin ?? false }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin ?? false }, token });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const { data: user, error } = await supabase
        .from('users').select('*').eq('email', email).maybeSingle();

      if (error || !user) return res.status(401).json({ error: 'Email ou senha incorretos' });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ error: 'Email ou senha incorretos' });

      const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin ?? false }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      return res.json({ user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin ?? false }, token });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      console.error(error);
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  async me(req: Request & { userId?: string }, res: Response) {
    try {
      const userId = (req as any).userId;
      const { data: user, error } = await supabase
        .from('users').select('id, name, email, createdAt').eq('id', userId).single();
      if (error || !user) return res.status(404).json({ error: 'Usuário não encontrado' });
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      const isDev = process.env.NODE_ENV !== 'production';
      let debugResetUrl: string | undefined;
      let debugError: string | undefined;

      const { data: user } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('email', email)
        .maybeSingle();

      if (user) {
        try {
          await ensureSupabaseAuthUser(user.email, user.name);

          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
          const redirectTo = `${frontendUrl.replace(/\/$/, '')}/reset-password`;

          const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo,
          });

          if (resetError) {
            console.error('Erro ao solicitar recuperação no Supabase Auth:', resetError);
            if (isDev) {
              debugError = resetError.message;
            }
          }

          if (isDev) {
            const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
              type: 'recovery',
              email: user.email,
              options: { redirectTo },
            } as any);

            if (linkError) {
              console.error('Erro ao gerar link de recuperação (debug):', linkError);
              debugError = debugError || linkError.message;
            } else {
              const dataAny = linkData as any;
              debugResetUrl = dataAny?.properties?.action_link || dataAny?.action_link;
            }
          }
        } catch (authError) {
          console.error('Erro ao preparar recuperação no Supabase Auth:', authError);
          if (isDev) {
            debugError = authError instanceof Error ? authError.message : 'Erro ao preparar recuperação';
          }
        }
      }

      return res.json({
        message: 'Se o e-mail existir, enviaremos as instruções de redefinição.',
        ...(isDev && debugResetUrl ? { debugResetUrl } : {}),
        ...(isDev && debugError ? { debugError } : {}),
      });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      console.error(error);
      return res.status(500).json({ error: 'Erro ao solicitar redefinição de senha' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, accessToken, password } = resetPasswordSchema.parse(req.body);

      if (accessToken) {
        const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
        if (authError || !authData?.user?.id || !authData.user.email) {
          return res.status(400).json({ error: 'Token inválido ou expirado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { error: localUpdateError } = await supabase
          .from('users')
          .update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            updatedAt: new Date().toISOString(),
          })
          .eq('email', authData.user.email);

        if (localUpdateError) {
          console.error(localUpdateError);
          return res.status(500).json({ error: 'Não foi possível redefinir a senha' });
        }

        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(authData.user.id, {
          password,
        });

        if (authUpdateError) {
          console.error(authUpdateError);
          return res.status(500).json({ error: 'Não foi possível redefinir a senha' });
        }

        return res.json({ message: 'Senha redefinida com sucesso.' });
      }

      const hashedToken = createHash('sha256').update(token as string).digest('hex');

      const { data: user, error } = await supabase
        .from('users')
        .select('id, resetPasswordExpires')
        .eq('resetPasswordToken', hashedToken)
        .maybeSingle();

      if (error || !user) return res.status(400).json({ error: 'Token inválido ou expirado' });

      if (!user.resetPasswordExpires || new Date(user.resetPasswordExpires).getTime() < Date.now()) {
        return res.status(400).json({ error: 'Token inválido ou expirado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error(updateError);
        return res.status(500).json({ error: 'Não foi possível redefinir a senha' });
      }

      return res.json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      console.error(error);
      return res.status(500).json({ error: 'Erro ao redefinir senha' });
    }
  }
}
