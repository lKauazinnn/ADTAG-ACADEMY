import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoData {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  order: number;
  module: { id: string; title: string };
  completed: boolean;
  watchedTime: number;
  canWatch: boolean;
  nextVideoId: string | null;
}

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [nextVideoId, setNextVideoId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string>('');
  const navigate = useNavigate();
  const progressInterval = useRef<ReturnType<typeof setInterval>>();
  const currentTime = useRef(0);
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadVideo();
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (playerRef.current?.destroy) { playerRef.current.destroy(); playerRef.current = null; }
    };
  }, [id]);

  // Inicializa YT.Player sobre o iframe existente para capturar eventos
  useEffect(() => {
    if (!video) return;
    setVideoEnded(false);

    const initPlayer = () => {
      if (!iframeRef.current) return;
      if (playerRef.current?.destroy) { playerRef.current.destroy(); playerRef.current = null; }

      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onStateChange: (event: any) => {
            const S = window.YT.PlayerState;
            if (event.data === S.PLAYING) {
              startProgress();
            } else if (event.data === S.PAUSED) {
              stopProgress();
            } else if (event.data === S.ENDED) {
              stopProgress();
              setVideoEnded(true);
            }
          },
        },
      });
    };

    // Aguarda o iframe estar no DOM antes de inicializar
    const timer = setTimeout(() => {
      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        if (!document.getElementById('yt-api-script')) {
          const tag = document.createElement('script');
          tag.id = 'yt-api-script';
          tag.src = 'https://www.youtube.com/iframe_api';
          document.head.appendChild(tag);
        }
        window.onYouTubeIframeAPIReady = initPlayer;
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [video?.url]);

  const startProgress = () => {
    if (progressInterval.current) return;
    progressInterval.current = setInterval(() => {
      currentTime.current += 5;
      updateProgress(currentTime.current);
    }, 5000);
  };

  const stopProgress = () => {
    if (progressInterval.current) { clearInterval(progressInterval.current); progressInterval.current = undefined; }
    updateProgress(currentTime.current);
  };

  const loadVideo = async () => {
    try {
      const response = await api.get(`/videos/${id}`);
      const v: VideoData = response.data;
      setVideo(v);
      setCompleted(v.completed);
      currentTime.current = v.watchedTime || 0;

      if (!v.canWatch) {
        alert('Conclua a aula anterior para acessar esta.');
        navigate(`/module/${v.module.id}`);
        return;
      }

      setNextVideoId(v.nextVideoId);
      setModuleId(v.module.id);
    } catch {
      alert('Erro ao carregar aula');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (watchedTime: number) => {
    try { await api.post(`/videos/${id}/progress`, { watchedTime }); } catch { /* silencioso */ }
  };

  const handleComplete = async () => {
    try {
      await api.post(`/videos/${id}/complete`, { watchedTime: video?.duration || 0 });
      if (nextVideoId) {
        navigate(`/video/${nextVideoId}`);
      } else {
        navigate(`/module/${moduleId || video!.module.id}`);
      }
    } catch {
      alert('Erro ao concluir a aula');
    }
  };

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const playerUrl = video
    ? (video.url.includes('?') ? `${video.url}&enablejsapi=1` : `${video.url}?enablejsapi=1`)
    : '';

  const canComplete = videoEnded || completed;

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
        <Header />
        <div className="flex flex-col items-center justify-center h-96 gap-3">
          <div className="w-7 h-7 border-[3px] border-t-transparent rounded-full animate-spin" style={{ borderColor: '#9333ea', borderTopColor: 'transparent' }} />
          <p className="text-[10px] uppercase tracking-widest" style={{ color: '#fafafa' }}>Carregando aula</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center text-sm" style={{ color: '#fafafa' }}>Aula não encontrada.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <div className="pointer-events-none fixed inset-0 z-0" style={{ top: 0, right: 0, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(49,168,255,0.05), transparent 65%)' }} />

      <Header />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">

        <button
          onClick={() => navigate(`/module/${video.module.id}`)}
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-5 transition-colors"
          style={{ color: '#fafafa' }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#31A8FF')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#fafafa')}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          {video.module.title}
        </button>

        <div className="grid lg:grid-cols-3 gap-5">

          <div className="lg:col-span-2 space-y-4">

            {/* Player — iframe normal com enablejsapi=1 */}
            <div className="rounded-2xl overflow-hidden border" style={{ background: '#000', borderColor: '#1e1e2e', boxShadow: '0 8px 40px rgba(0,0,0,0.7)' }}>
              <iframe
                ref={iframeRef}
                src={playerUrl}
                title={video.title}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Info */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#12121a', border: '1px solid #252538', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
              <div className="h-[3px]" style={{ background: completed ? 'linear-gradient(90deg,#31A8FF,#0ea5e9)' : 'linear-gradient(90deg,#9333ea,#EA77FF)' }} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                    style={{ background: 'rgba(147,51,234,0.1)', color: '#9333ea', border: '1px solid rgba(147,51,234,0.2)' }}>
                    Aula {video.order}
                  </span>
                  {completed && (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1"
                      style={{ background: 'rgba(49,168,255,0.1)', color: '#31A8FF', border: '1px solid rgba(49,168,255,0.2)' }}>
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      Concluída
                    </span>
                  )}
                </div>

                <h1 className="text-lg font-black mb-1 tracking-tight" style={{ color: '#fafafa' }}>{video.title}</h1>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: '#9494b8' }}>{video.description}</p>

                <div className="flex items-center gap-3 text-xs mb-4" style={{ color: '#6b6b8a' }}>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-mono">{formatDuration(video.duration)}</span>
                  </span>
                </div>

                {!completed ? (
                  <button
                    onClick={handleComplete}
                    disabled={!canComplete}
                    className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all"
                    style={canComplete
                      ? { background: 'linear-gradient(135deg,#9333ea,#6d28d9)', color: '#fff', boxShadow: '0 0 24px rgba(147,51,234,0.25)', cursor: 'pointer' }
                      : { background: 'rgba(147,51,234,0.08)', color: '#6b6b8a', border: '1px solid rgba(147,51,234,0.15)', cursor: 'not-allowed' }
                    }
                  >
                    {canComplete ? 'Marcar como Concluída' : '⏳ Assista o vídeo até o fim para concluir'}
                  </button>
                ) : (
                  <div className="py-3 rounded-xl text-sm font-bold text-center tracking-wide"
                    style={{ background: 'rgba(49,168,255,0.08)', color: '#31A8FF', border: '1px solid rgba(49,168,255,0.2)' }}>
                    {nextVideoId ? 'Aula concluída — indo para a próxima...' : 'Módulo concluído! 🎉'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="rounded-2xl p-5 sticky top-4" style={{ background: '#12121a', border: '1px solid #252538', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: '#31A8FF' }}>Módulo atual</p>
              <h3 className="text-sm font-black mb-1" style={{ color: '#fafafa' }}>{video.module.title}</h3>
              <p className="text-xs mb-5" style={{ color: '#9494b8' }}>Aula {video.order}</p>

              {(() => {
                const cat = sessionStorage.getItem('currentCategory') || 'editor';
                const toolsMap: Record<string, { abbr: string; color: string }[]> = {
                  editor:  [{ abbr: 'Ps', color: '#31A8FF' }, { abbr: 'Pr', color: '#EA77FF' }, { abbr: 'Ai', color: '#FF9A00' }],
                  social:  [{ abbr: 'Ps', color: '#31A8FF' }, { abbr: 'Pr', color: '#EA77FF' }, { abbr: 'Ai', color: '#FF9A00' }, { abbr: 'Ae', color: '#9999FF' }, { abbr: 'Lr', color: '#31C5F4' }, { abbr: 'Id', color: '#FF3870' }],
                  musicos: [{ abbr: 'Ps', color: '#31A8FF' }, { abbr: 'Pr', color: '#EA77FF' }, { abbr: 'Ai', color: '#FF9A00' }, { abbr: 'Ae', color: '#9999FF' }, { abbr: 'Lr', color: '#31C5F4' }, { abbr: 'Id', color: '#FF3870' }],
                };
                const tools = toolsMap[cat];
                if (!tools) return null;
                return (
                  <div className="mb-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#9494b8' }}>Ferramentas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tools.map(t => (
                        <span key={t.abbr} className="text-[10px] font-black px-2 py-0.5 rounded"
                          style={{ fontFamily: 'monospace', color: t.color, background: t.color + '14', border: `1px solid ${t.color}33` }}>
                          {t.abbr}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="rounded-xl p-4" style={{ background: '#1a1a25', border: '1px solid rgba(147,51,234,0.15)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="#9333ea" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#9333ea' }}>Dica do instrutor</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#9494b8' }}>
                  Assista até o fim e clique em "Marcar como Concluída" para ir para a próxima aula.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
