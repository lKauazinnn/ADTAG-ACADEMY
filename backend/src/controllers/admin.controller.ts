import { Response } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import supabase from '../lib/supabase';
import { AuthRequest } from '../middlewares/auth.middleware';

const moduleSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().min(1, 'Descrição obrigatória'),
  order: z.number().int().positive('Ordem deve ser um número positivo'),
});

const videoSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().min(1, 'Descrição obrigatória'),
  url: z.string().url('URL inválida'),
  duration: z.number().int().positive('Duração deve ser positiva'),
  order: z.number().int().positive('Ordem deve ser positiva'),
  moduleId: z.string().uuid('moduleId inválido'),
});

export class AdminController {
  async getStats(req: AuthRequest, res: Response) {
    try {
      const [
        { count: totalUsers },
        { count: totalModules },
        { count: totalVideos },
        { count: totalCompletions },
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('modules').select('*', { count: 'exact', head: true }),
        supabase.from('videos').select('*', { count: 'exact', head: true }),
        supabase.from('video_progress').select('*', { count: 'exact', head: true }).eq('completed', true),
      ]);

      // Progresso médio: completions / (users * videos) * 100
      const avgProgress =
        totalUsers && totalVideos && totalUsers > 0 && totalVideos > 0
          ? Math.round(((totalCompletions ?? 0) / ((totalUsers ?? 1) * (totalVideos ?? 1))) * 100)
          : 0;

      return res.json({ totalUsers, totalModules, totalVideos, totalCompletions, avgProgress });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }

  async listUsers(req: AuthRequest, res: Response) {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email, isAdmin, createdAt')
        .order('createdAt', { ascending: false });

      if (error) return res.status(500).json({ error: 'Erro ao buscar usuários' });

      const { count: totalVideos } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });

      const { data: progressData } = await supabase
        .from('video_progress')
        .select('userId')
        .eq('completed', true);

      const completionsByUser: Record<string, number> = {};
      for (const p of progressData ?? []) {
        completionsByUser[p.userId] = (completionsByUser[p.userId] ?? 0) + 1;
      }

      const usersWithProgress = (users ?? []).map((u) => ({
        ...u,
        completedVideos: completionsByUser[u.id] ?? 0,
        totalVideos: totalVideos ?? 0,
        progressPercent:
          totalVideos && totalVideos > 0
            ? Math.round(((completionsByUser[u.id] ?? 0) / totalVideos) * 100)
            : 0,
      }));

      return res.json(usersWithProgress);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }

  // --- Modules ---

  async createModule(req: AuthRequest, res: Response) {
    try {
      const data = moduleSchema.parse(req.body);
      const now = new Date().toISOString();

      const { data: module, error } = await supabase
        .from('modules')
        .insert({ id: randomUUID(), ...data, createdAt: now, updatedAt: now })
        .select()
        .single();

      if (error) return res.status(500).json({ error: 'Erro ao criar módulo' });
      return res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar módulo' });
    }
  }

  async updateModule(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data = moduleSchema.partial().parse(req.body);

      const { data: module, error } = await supabase
        .from('modules')
        .update({ ...data, updatedAt: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) return res.status(500).json({ error: 'Erro ao atualizar módulo' });
      return res.json(module);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar módulo' });
    }
  }

  async deleteModule(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('modules').delete().eq('id', id);
      if (error) return res.status(500).json({ error: 'Erro ao excluir módulo' });
      return res.json({ message: 'Módulo excluído com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir módulo' });
    }
  }

  // --- Videos ---

  async createVideo(req: AuthRequest, res: Response) {
    try {
      const data = videoSchema.parse(req.body);
      const now = new Date().toISOString();

      const { data: video, error } = await supabase
        .from('videos')
        .insert({ id: randomUUID(), ...data, createdAt: now, updatedAt: now })
        .select()
        .single();

      if (error) return res.status(500).json({ error: 'Erro ao criar vídeo' });
      return res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar vídeo' });
    }
  }

  async updateVideo(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data = videoSchema.partial().parse(req.body);

      const { data: video, error } = await supabase
        .from('videos')
        .update({ ...data, updatedAt: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) return res.status(500).json({ error: 'Erro ao atualizar vídeo' });
      return res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar vídeo' });
    }
  }

  async deleteVideo(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) return res.status(500).json({ error: 'Erro ao excluir vídeo' });
      return res.json({ message: 'Vídeo excluído com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir vídeo' });
    }
  }
}
