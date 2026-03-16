import { Response } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import supabase from '../lib/supabase';
import { AuthRequest } from '../middlewares/auth.middleware';

const watchedTimeSchema = z.object({ watchedTime: z.number().min(0) });

export class VideoController {
  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const { data: video, error } = await supabase.from('videos').select('*, modules(id, title)').eq('id', id).single();
      if (error || !video) return res.status(404).json({ error: 'Vídeo não encontrado' });
      const { data: progress } = await supabase.from('video_progress').select('*').eq('userId', userId).eq('videoId', id).maybeSingle();
      const canWatch = await this.canWatchVideo(userId, video.order, video.moduleId);
      const { data: nextVideo } = await supabase.from('videos').select('id').eq('moduleId', video.moduleId).eq('"order"', video.order + 1).maybeSingle();
      return res.json({ id: video.id, title: video.title, description: video.description, url: video.url, duration: video.duration, order: video.order, module: { id: video.modules.id, title: video.modules.title }, completed: progress?.completed || false, watchedTime: progress?.watchedTime || 0, canWatch, nextVideoId: nextVideo?.id || null });
    } catch (error) { console.error(error); return res.status(500).json({ error: 'Erro ao buscar vídeo' }); }
  }

  async complete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const { watchedTime } = watchedTimeSchema.parse(req.body);
      const { data: video, error } = await supabase.from('videos').select('id, "order", moduleId').eq('id', id).single();
      if (error || !video) return res.status(404).json({ error: 'Vídeo não encontrado' });
      const canWatch = await this.canWatchVideo(userId, video.order, video.moduleId);
      if (!canWatch) return res.status(403).json({ error: 'Complete o vídeo anterior primeiro' });
      const { data: existing } = await supabase.from('video_progress').select('id').eq('userId', userId).eq('videoId', id).maybeSingle();
      const now = new Date().toISOString();
      let result;
      if (existing) {
        const { data } = await supabase.from('video_progress').update({ completed: true, watchedTime, updatedAt: now }).eq('userId', userId).eq('videoId', id).select().single();
        result = data;
      } else {
        const { data } = await supabase.from('video_progress').insert({ id: randomUUID(), userId, videoId: id, completed: true, watchedTime, updatedAt: now }).select().single();
        result = data;
      }
      return res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      console.error(error); return res.status(500).json({ error: 'Erro ao completar vídeo' });
    }
  }

  async updateProgress(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const { watchedTime } = watchedTimeSchema.parse(req.body);
      const { data: existing } = await supabase.from('video_progress').select('id').eq('userId', userId).eq('videoId', id).maybeSingle();
      const now = new Date().toISOString();
      let result;
      if (existing) {
        const { data } = await supabase.from('video_progress').update({ watchedTime, updatedAt: now }).eq('userId', userId).eq('videoId', id).select().single();
        result = data;
      } else {
        const { data } = await supabase.from('video_progress').insert({ id: randomUUID(), userId, videoId: id, watchedTime, completed: false, updatedAt: now }).select().single();
        result = data;
      }
      return res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      console.error(error); return res.status(500).json({ error: 'Erro ao atualizar progresso' });
    }
  }

  private async canWatchVideo(userId: string, videoOrder: number, moduleId: string): Promise<boolean> {
    if (videoOrder === 1) return true;
    const { data: previousVideo } = await supabase.from('videos').select('id').eq('moduleId', moduleId).eq('order', videoOrder - 1).maybeSingle();
    if (!previousVideo) return true;
    const { data: previousProgress } = await supabase.from('video_progress').select('completed').eq('userId', userId).eq('videoId', previousVideo.id).maybeSingle();
    return previousProgress?.completed || false;
  }
}
