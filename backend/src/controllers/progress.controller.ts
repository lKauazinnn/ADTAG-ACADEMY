import { Response } from 'express';
import supabase from '../lib/supabase';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ProgressController {
  async getOverall(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { data: modules, error } = await supabase.from('modules').select('*, videos(*)').order('order', { ascending: true });
      if (error) { console.error(error); return res.status(500).json({ error: 'Erro ao buscar progresso' }); }
      const allVideoIds = (modules || []).flatMap((m: any) => m.videos.map((v: any) => v.id));
      const { data: allProgress } = allVideoIds.length > 0
        ? await supabase.from('video_progress').select('*').eq('userId', userId).in('videoId', allVideoIds)
        : { data: [] };
      const stats = (modules || []).map((module: any) => {
        const totalVideos = module.videos.length;
        const completedVideos = module.videos.filter((v: any) => (allProgress || []).find((p: any) => p.videoId === v.id && p.completed)).length;
        const progressPercentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
        return { moduleId: module.id, moduleTitle: module.title, totalVideos, completedVideos, progressPercentage };
      });
      const totalVideos = allVideoIds.length;
      const totalCompleted = (allProgress || []).filter((p: any) => p.completed).length;
      const overallProgress = totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0;
      return res.json({ overallProgress, totalVideos, totalCompleted, modules: stats });
    } catch (error) { console.error(error); return res.status(500).json({ error: 'Erro ao buscar progresso' }); }
  }

  async getByModule(req: AuthRequest, res: Response) {
    try {
      const { moduleId } = req.params;
      const userId = req.userId!;
      const { data: module, error } = await supabase.from('modules').select('*, videos(*)').eq('id', moduleId).single();
      if (error || !module) return res.status(404).json({ error: 'Módulo não encontrado' });
      const videoIds = module.videos.map((v: any) => v.id);
      const { data: progressList } = videoIds.length > 0
        ? await supabase.from('video_progress').select('*').eq('userId', userId).in('videoId', videoIds)
        : { data: [] };
      const videosWithProgress = [...module.videos].sort((a: any, b: any) => a.order - b.order).map((video: any) => {
        const progress = (progressList || []).find((p: any) => p.videoId === video.id);
        return { id: video.id, title: video.title, order: video.order, duration: video.duration, completed: progress?.completed || false, watchedTime: progress?.watchedTime || 0 };
      });
      const totalVideos = module.videos.length;
      const completedVideos = videosWithProgress.filter((v: any) => v.completed).length;
      const progressPercentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
      return res.json({ moduleId: module.id, moduleTitle: module.title, totalVideos, completedVideos, progressPercentage, videos: videosWithProgress });
    } catch (error) { console.error(error); return res.status(500).json({ error: 'Erro ao buscar progresso do módulo' }); }
  }
}
