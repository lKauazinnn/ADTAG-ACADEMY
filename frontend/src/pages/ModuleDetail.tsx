import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';
import { Module } from '../types';

const ModuleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadModule(); }, [id]);

  const loadModule = async () => {
    try {
      const response = await api.get(`/modules/${id}`);
      setModule(response.data);
    } catch (error) {
      console.error('Erro ao carregar módulo:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getNextUnwatchedVideo = () => {
    if (!module) return null;
    return module.videos.find((v: any) => !v.completed);
  };

  const handleVideoClick = (videoId: string, canWatch: boolean) => {
    if (!canWatch) {
      alert('Conclua a aula anterior para desbloquear esta.');
      return;
    }
    navigate(`/video/${videoId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
        <Header />
        <div className="flex flex-col items-center justify-center h-96 gap-3">
          <div className="w-7 h-7 border-[3px] border-t-transparent rounded-full animate-spin" style={{ borderColor: '#9333ea', borderTopColor: 'transparent' }} />
          <p className="text-[10px] uppercase tracking-widest" style={{ color: '#fafafa' }}>Carregando</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center text-sm" style={{ color: '#fafafa' }}>
          Módulo não encontrado.
        </div>
      </div>
    );
  }

  const nextVideo = getNextUnwatchedVideo();
  const completedCount = module.videos.filter((v: any) => v.completed).length;
  const progressPct = Math.round((completedCount / module.videos.length) * 100);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Glow sutil */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ top: 0, left: 0, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(49,168,255,0.05), transparent 65%)' }} />

      <Header />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">

        {/* Cabeçalho do módulo */}
        <div className="rounded-2xl overflow-hidden mb-5" style={{ background: '#12121a', border: '1px solid #252538', boxShadow: '0 4px 30px rgba(0,0,0,0.5), 0 0 60px rgba(49,168,255,0.04)' }}>
          {/* Faixa topo */}
          <div className="h-[3px] animate-gradient-shift" style={{ background: 'linear-gradient(90deg,#31A8FF,#9333ea,#EA77FF,#31A8FF)', backgroundSize: '200% 100%' }} />

          <div className="p-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-5 transition-colors"
              style={{ color: '#fafafa' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#31A8FF')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#fafafa')}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Trilhas Criativas
            </button>

            <h1 className="text-xl font-black mb-1.5 tracking-tight" style={{ color: '#fafafa' }}>{module.title}</h1>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: '#9494b8' }}>{module.description}</p>

            {/* Barra de progresso */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: '#fafafa' }}>Progresso da trilha</span>
              <span className="text-[10px] font-black" style={{ color: '#31A8FF' }}>{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full mb-5" style={{ background: '#1a1a25' }}>
              <div className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#31A8FF,#9333ea)' }} />
            </div>

            {/* Metadados */}
            <div className="flex items-center gap-5 mb-5">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: '#9494b8' }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                {module.videos.length} aulas
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: '#31A8FF' }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {completedCount} concluídas
              </span>
            </div>

            {nextVideo && (
              <button
                onClick={() => handleVideoClick(nextVideo.id, true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all"
                style={{ background: 'linear-gradient(135deg,#31A8FF,#9333ea)', color: '#fff', boxShadow: '0 0 24px rgba(49,168,255,0.2)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Continuar Assistindo
              </button>
            )}
          </div>
        </div>

        {/* Lista de aulas */}
        <div className="space-y-2">
          {module.videos.map((video, index) => {
            const isFirst = index === 0;
            const prevCompleted = index === 0 || (module.videos[index - 1]?.completed ?? false);
            const canWatch = isFirst || prevCompleted;

            return (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video.id, canWatch)}
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                  background: '#12121a',
                  border: '1px solid ' + (video.completed ? 'rgba(49,168,255,0.2)' : '#1e1e2e'),
                  borderLeft: `2px solid ${video.completed ? '#31A8FF' : canWatch ? '#9333ea' : '#1e1e2e'}`,
                  cursor: canWatch ? 'pointer' : 'not-allowed',
                  opacity: canWatch ? 1 : 0.4,
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                }}
                onMouseEnter={e => { if (!canWatch) return; const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateX(3px)'; el.style.boxShadow = video.completed ? '0 4px 20px rgba(49,168,255,0.12)' : '0 4px 20px rgba(147,51,234,0.12)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ''; el.style.boxShadow = ''; }}
              >
                {/* Indicador visual */}
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: video.completed ? 'rgba(49,168,255,0.12)' : 'rgba(147,51,234,0.08)',
                    border: `1px solid ${video.completed ? '#31A8FF33' : '#9333ea22'}`,
                  }}>
                  {video.completed ? (
                    <svg className="w-4 h-4" fill="none" stroke="#31A8FF" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : !canWatch ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="#fafafa" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="#9333ea" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#6b6b8a' }}>Aula {video.order}</span>
                  </div>
                  <p className="text-sm font-semibold truncate" style={{ color: '#fafafa' }}>{video.title}</p>
                  {video.description && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#9494b8' }}>{video.description}</p>
                  )}
                </div>

                {/* Duração */}
                <div className="flex-shrink-0 text-right">
                  <span className="text-xs font-mono" style={{ color: '#6b6b8a' }}>{formatDuration(video.duration)}</span>
                  {video.watchedTime && video.watchedTime > 0 && !video.completed && (
                    <p className="text-[10px] mt-0.5" style={{ color: '#9333ea' }}>retomar</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
