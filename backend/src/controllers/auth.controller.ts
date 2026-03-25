import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { createHash, randomBytes, randomUUID } from 'crypto';
import supabase from '../lib/supabase';
import { sendPasswordResetEmail } from '../lib/mailer';

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

const resetPasswordSchema = z.object({
  token: z.string().min(10, 'Token inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

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

      const { data: user } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('email', email)
        .maybeSingle();

      if (user) {
        const rawToken = randomBytes(32).toString('hex');
        const hashedToken = createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        const { error: updateError } = await supabase
          .from('users')
          .update({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: expiresAt,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (!updateError) {
          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
          const resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${rawToken}`;
          await sendPasswordResetEmail(user.email, user.name, resetUrl);
        }
      }

      return res.json({ message: 'Se o e-mail existir, enviaremos as instruções de redefinição.' });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      console.error(error);
      return res.status(500).json({ error: 'Erro ao solicitar redefinição de senha' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);
      const hashedToken = createHash('sha256').update(token).digest('hex');

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
