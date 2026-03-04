import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { randomUUID } from 'crypto';
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
}
