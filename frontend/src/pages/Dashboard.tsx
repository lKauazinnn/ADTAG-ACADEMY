import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Module, Progress } from '../types';

// Paleta das ferramentas Adobe — usada nos cards dos módulos
const adobeTools = [
  { abbr: 'Ps', name: 'Photoshop',    color: '#31A8FF', dark: '#0d5c91' },
  { abbr: 'Pr', name: 'Premiere',     color: '#EA77FF', dark: '#7a3090' },
  { abbr: 'Ai', name: 'Illustrator',  color: '#FF9A00', dark: '#8c5000' },
  { abbr: 'Ae', name: 'After Effects',color: '#9999FF', dark: '#444499' },
  { abbr: 'Lr', name: 'Lightroom',    color: '#31C5F4', dark: '#0b6e8c' },
  { abbr: 'Id', name: 'InDesign',     color: '#FF3870', dark: '#8c1a3a' },
];

const getToolForModule = (title: string, fallbackIndex: number) => {
  const t = title.toLowerCase();
  if (t.includes('premiere'))                          return adobeTools[1]; // Pr
  if (t.includes('photoshop'))                         return adobeTools[0]; // Ps
  if (t.includes('lightroom') || t.includes('fotografia')) return adobeTools[4]; // Lr
  if (t.includes('after effects') || t.includes('motion')) return adobeTools[3]; // Ae
  if (t.includes('illustrator') || t.includes('ilustração')) return adobeTools[2]; // Ai
  if (t.includes('indesign'))                          return adobeTools[5]; // Id
  return adobeTools[fallbackIndex % adobeTools.length];
};

const Dashboard: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [modRes, progRes] = await Promise.all([
        api.get('/modules'),
        api.get('/progress'),
      ]);
      setModules(modRes.data);
      setProgress(progRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
        <Header />
        <div className="flex flex-col items-center justify-center h-96 gap-3">
          <div className="w-7 h-7 border-[3px] border-t-transparent rounded-full animate-spin" style={{ borderColor: '#9333ea', borderTopColor: 'transparent' }} />
          <p className="text-xs tracking-widest uppercase" style={{ color: '#fafafa' }}>Carregando</p>
        </div>
      </div>
    );
  }

  const pct = progress?.overallProgress ?? 0;
  const completed = progress?.totalCompleted ?? 0;
  const total = progress?.totalVideos ?? 0;

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Marca d'água */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage: 'url(/marca-dagua.png)',
        backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '38%',
        opacity: 0.018, filter: 'invert(1)',
      }} />

      {/* Glows ambientais */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute" style={{ top: 0, right: 0, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(49,168,255,0.07), transparent 65%)' }} />
        <div className="absolute" style={{ bottom: 0, left: 0, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.07), transparent 65%)' }} />
      </div>

      <Header />

      {/* Banner */}
      <div className="relative z-10" style={{ background: '#0f0f14', borderBottom: '1px solid #1e1e2e' }}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* Saudação */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: '#31A8FF' }}>
                Creative Studio · ADTAG
              </p>
              <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: '#fafafa' }}>
                {user?.name}
              </h1>
              <p className="text-sm" style={{ color: '#fafafa' }}>
                Domine o Photoshop, Premiere, After Effects e muito mais
              </p>
            </div>

            {/* Progresso */}
            <div className="flex items-center gap-6">
              {/* Anel SVG */}
              <div className="relative flex-shrink-0">
                <svg width="74" height="74" viewBox="0 0 74 74">
                  <circle cx="37" cy="37" r="30" fill="none" stroke="#1a1a28" strokeWidth="6" />
                  <circle
                    cx="37" cy="37" r="30" fill="none"
                    stroke="url(#dashGrad)" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - pct / 100)}`}
                    transform="rotate(-90 37 37)"
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                  <defs>
                    <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#31A8FF" />
                      <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-black leading-none" style={{ color: '#fafafa' }}>{pct}%</span>
                  <span className="text-[9px] mt-0.5 uppercase tracking-wider" style={{ color: '#fafafa' }}>geral</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4">
                {[
                  { val: total,           label: 'Aulas',      color: '#fafafa' },
                  { val: completed,       label: 'Concluídas', color: '#31A8FF' },
                  { val: total-completed, label: 'Restantes',  color: '#FF9A00' },
                ].map((s, i, arr) => (
                  <React.Fragment key={s.label}>
                    <div className="text-center">
                      <p className="text-xl font-black leading-none" style={{ color: s.color }}>{s.val}</p>
                      <p className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: '#fafafa' }}>{s.label}</p>
                    </div>
                    {i < arr.length - 1 && <div className="w-px self-stretch" style={{ background: '#1e1e2e' }} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">

        {/* Cabeçalho da seção */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            {/* Ícone de camadas */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#31A8FF' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: '#fafafa' }}>
              Trilhas Criativas
            </span>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full font-medium" style={{ color: '#fafafa', background: '#12121a', border: '1px solid #1e1e2e' }}>
            {modules.length} módulos
          </span>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module, index) => {
            const mp = progress?.modules.find(m => m.moduleId === module.id);
            const modPct = mp?.progressPercentage ?? 0;
            const tool = getToolForModule(module.title, index);
            const totalSecs = module.videos.reduce((acc, v) => acc + v.duration, 0);

            const statusLabel = modPct === 100 ? 'Concluído' : modPct > 0 ? 'Em andamento' : 'Disponível';
            const statusStyle =
              modPct === 100
                ? { background: 'rgba(49,168,255,0.1)', color: '#31A8FF', border: `1px solid ${tool.color}33` }
                : modPct > 0
                ? { background: `${tool.color}14`, color: tool.color, border: `1px solid ${tool.color}33` }
                : { background: '#1a1a25', color: '#fafafa', border: '1px solid #1e1e2e' };

            return (
              <div
                key={module.id}
                onClick={() => navigate(`/module/${module.id}`)}
                className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200"
                style={{ background: '#12121a', border: '1px solid #1e1e2e', boxShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = tool.color + '44';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${tool.color}22`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e2e';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.5)';
                }}
              >
                {/* Header do card */}
                <div className="p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${tool.dark}, #0a0a0f 80%)`, borderBottom: `1px solid ${tool.color}22` }}>

                  {/* Abreviação Adobe grande no fundo */}
                  <span
                    className="absolute right-3 bottom-0 text-[72px] font-black leading-none select-none"
                    style={{ color: tool.color, opacity: 0.07, fontFamily: 'monospace', letterSpacing: '-0.04em' }}
                  >
                    {tool.abbr}
                  </span>

                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      {/* Badge de status */}
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3 uppercase tracking-wider" style={statusStyle}>
                        {statusLabel}
                      </span>
                      <h3 className="font-bold text-sm leading-snug" style={{ color: '#fafafa' }}>
                        {module.title}
                      </h3>
                    </div>

                    {/* Badge da ferramenta */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: tool.color + '1a', border: `1px solid ${tool.color}33` }}>
                      <span className="text-[11px] font-black" style={{ color: tool.color, fontFamily: 'monospace' }}>{tool.abbr}</span>
                    </div>
                  </div>
                </div>

                {/* Corpo */}
                <div className="px-5 py-4">
                  <p className="text-xs mb-4 line-clamp-2 leading-relaxed" style={{ color: '#fafafa' }}>
                    {module.description}
                  </p>

                  {/* Progresso */}
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: '#fafafa' }}>
                      {mp?.completedVideos ?? 0} / {mp?.totalVideos ?? module.videos.length} aulas
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: tool.color }}>{modPct}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full mb-4" style={{ background: '#1a1a25' }}>
                    <div className="h-1 rounded-full transition-all duration-700"
                      style={{ width: `${modPct}%`, background: `linear-gradient(90deg,${tool.color},${tool.dark})` }} />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px]" style={{ color: '#fafafa' }}>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDuration(totalSecs)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                        {module.videos.length} aulas
                      </span>
                    </div>

                    <span className="text-[11px] font-bold flex items-center gap-1 transition-all group-hover:gap-1.5" style={{ color: tool.color }}>
                      Abrir
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-14 pb-4 text-center">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 mb-1">
              {['Ps','Pr','Ai','Ae'].map((t, i) => (
                <span key={t} className="text-[9px] font-black px-1.5 py-0.5 rounded"
                  style={{ fontFamily: 'monospace', color: adobeTools[i].color, background: adobeTools[i].color + '12', border: `1px solid ${adobeTools[i].color}22` }}>
                  {t}
                </span>
              ))}
            </div>
            <img src="/logo.png" alt="ADTAG" className="h-6 w-auto object-contain"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
            <p className="text-[10px]" style={{ color: '#fafafa' }}>© 2026 · Creative Studio UNIDOS – Juventude ADTAG</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
