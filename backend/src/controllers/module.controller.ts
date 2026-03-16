import { Response } from 'express';
import supabase from '../lib/supabase';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ModuleController {
  async list(req: AuthRequest, res: Response) {
    try {
      const category = req.query.category as string | undefined;
      let query = supabase
        .from('modules')
        .select('*, videos(id, title, description, duration, "order")');

      if (category === 'editor')  query = query.lt('order', 10);
      if (category === 'social')  query = query.gte('order', 10).lt('order', 20);
      if (category === 'musicos') query = query.gte('order', 20).lt('order', 30);

      const { data: modules, error } = await query.order('order', { ascending: true });
      if (error) { console.error(error); return res.status(500).json({ error: 'Erro ao listar módulos' }); }
      return res.json(modules);
    } catch (error) { console.error(error); return res.status(500).json({ error: 'Erro ao listar módulos' }); }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const { data: module, error } = await supabase
        .from('modules').select('*, videos(*)').eq('id', id).single();
      if (error || !module) return res.status(404).json({ error: 'Módulo não encontrado' });

      const videoIds = module.videos.map((v: any) => v.id);
      const { data: progressList } = await supabase
        .from('video_progress').select('*').eq('userId', userId).in('videoId', videoIds);

      const videos = [...module.videos]
        .sort((a: any, b: any) => a.order - b.order)
        .map((video: any) => {
          const progress = progressList?.find((p: any) => p.videoId === video.id);
          return { id: video.id, title: video.title, description: video.description, url: video.url, duration: video.duration, order: video.order, completed: progress?.completed || false, watchedTime: progress?.watchedTime || 0 };
        });
      return res.json({ ...module, videos });
    } catch (error) { console.error(error); return res.status(500).json({ error: 'Erro ao buscar módulo' }); }
  }
}
