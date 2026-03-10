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

// Floating particles in hero
const PARTICLES = [
  { size: 4,  top: '18%', left: '15%', color: '#31A8FF', delay: 0    },
  { size: 3,  top: '65%', left: '22%', color: '#9333ea', delay: 1.1  },
  { size: 5,  top: '30%', left: '75%', color: '#EA77FF', delay: 0.6  },
  { size: 3,  top: '78%', left: '68%', color: '#FF9A00', delay: 1.8  },
  { size: 4,  top: '48%', left: '88%', color: '#31C5F4', delay: 2.3  },
  { size: 3,  top: '12%', left: '55%', color: '#FF3870', delay: 0.9  },
  { size: 2,  top: '85%', left: '40%', color: '#9999FF', delay: 1.5  },
];

const Dashboard: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [ringPct, setRingPct] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { loadData(); }, []);
  useEffect(() => {
    if (progress) {
      const t = setTimeout(() => setRingPct(progress.overallProgress ?? 0), 400);
      return () => clearTimeout(t);
    }
  }, [progress]);

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
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#9333ea22', borderTopColor: '#9333ea', borderRightColor: '#31A8FF' }} />
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.12), transparent)' }} />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: '#9494b8' }}>Carregando</p>
            <p className="text-[10px] mt-1" style={{ color: '#6b6b8a' }}>Buscando suas trilhas...</p>
          </div>
        </div>
      </div>
    );
  }

  const completed = progress?.totalCompleted ?? 0;
  const total = progress?.totalVideos ?? 0;

  return (
    <div className="min-h-screen" style={{ background: '#050509' }}>
      {/* ── Background atmosférico completo ── */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ overflow: 'hidden' }}>
        {/* Base mesh gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 120% 70% at 80% -10%, rgba(49,168,255,0.22), transparent 55%), radial-gradient(ellipse 90% 80% at -10% 60%, rgba(147,51,234,0.22), transparent 55%), radial-gradient(ellipse 70% 60% at 50% 120%, rgba(234,119,255,0.12), transparent 55%)' }} />
        {/* Large color orbs */}
        <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(49,168,255,0.18) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-15%', width: 1000, height: 1000, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.18) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,119,255,0.08) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '20%', right: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,154,0,0.07) 0%, transparent 65%)', filter: 'blur(30px)' }} />
        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 20%, transparent 80%)',
          maskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 20%, transparent 80%)',
        }} />
        {/* Vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)' }} />
      </div>

      {/* Marca d'água */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage: 'url(/marca-dagua.png)',
        backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '38%',
        opacity: 0.018, filter: 'invert(1)',
      }} />

      <Header />

      {/* Hero Banner */}
      <div className="relative z-10 overflow-hidden" style={{ background: 'rgba(5,5,12,0.55)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Aurora layers */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute" style={{ inset: 0, background: 'radial-gradient(ellipse 110% 90% at 95% 10%, rgba(49,168,255,0.32), transparent 55%)' }} />
          <div className="absolute" style={{ inset: 0, background: 'radial-gradient(ellipse 90% 110% at -5% 95%, rgba(147,51,234,0.28), transparent 55%)' }} />
          <div className="absolute" style={{ inset: 0, background: 'radial-gradient(ellipse 70% 70% at 60% 120%, rgba(234,119,255,0.14), transparent 55%)' }} />
          <div className="absolute" style={{ inset: 0, background: 'radial-gradient(ellipse 55% 55% at 15% -15%, rgba(255,154,0,0.1), transparent 55%)' }} />
          {/* Bottom glow edge */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(49,168,255,0.5), rgba(147,51,234,0.5), rgba(234,119,255,0.5), transparent)' }} />
          {/* Floating particles */}
          {PARTICLES.map((p, i) => (
            <div key={i} className="absolute animate-float" style={{ top: p.top, left: p.left, animationDelay: `${p.delay}s`, animationDuration: `${4 + i * 0.4}s` }}>
              <div style={{ width: p.size, height: p.size, borderRadius: '50%', background: p.color, boxShadow: `0 0 ${p.size * 3}px ${p.color}`, opacity: 0.6 }} />
            </div>
          ))}
        </div>
        {/* Grid with radial mask */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '58px 58px',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 100% at 50% 0%, black 30%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 90% 100% at 50% 0%, black 30%, transparent 100%)',
        }} />

        <div className="max-w-5xl mx-auto px-6 py-14 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">

            {/* Saudação */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#31A8FF', boxShadow: '0 0 10px #31A8FF, 0 0 24px rgba(49,168,255,0.5)' }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#31A8FF' }}>Creative Studio · ADTAG</span>
              </div>

              <div style={{ marginBottom: '1.1rem' }}>
                <span style={{ display: 'block', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#fafafa' }}>
                  Olá,
                </span>
                <span style={{ display: 'block', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1, color: '#fafafa' }}>
                  {user?.name?.split(' ')[0] ?? user?.name}
                </span>
              </div>

              <p style={{ color: '#9494b8', fontSize: '0.875rem', maxWidth: 340, lineHeight: 1.7, marginBottom: '1.75rem' }}>
                Domine o Photoshop, Premiere, After Effects e muito mais
              </p>

              <div className="flex items-center gap-2">
                {adobeTools.map(t => (
                  <div key={t.abbr} title={t.name}
                    style={{ width: 38, height: 38, borderRadius: 10, background: t.color + '12', border: `1px solid ${t.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 20px ${t.color}33`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
                  >
                    <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 11, color: t.color }}>{t.abbr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progresso */}
            <div className="flex items-center gap-8">
              {/* Anel SVG com glow atrás */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ position: 'absolute', inset: -24, borderRadius: '50%', background: 'radial-gradient(circle, rgba(49,168,255,0.22) 0%, transparent 70%)', filter: 'blur(18px)', pointerEvents: 'none' }} />
                <svg width="112" height="112" viewBox="0 0 112 112">
                  <circle cx="56" cy="56" r="48" fill="none" stroke="#12122a" strokeWidth="9" />
                  <circle
                    cx="56" cy="56" r="48" fill="none"
                    stroke="url(#heroGrad)" strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={`${2 * Math.PI * 48 * (1 - ringPct / 100)}`}
                    transform="rotate(-90 56 56)"
                    style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.34,1.56,0.64,1)', filter: 'drop-shadow(0 0 8px rgba(49,168,255,0.65))' }}
                  />
                  <defs>
                    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#31A8FF" />
                      <stop offset="55%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#EA77FF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#fafafa', lineHeight: 1, letterSpacing: '-0.03em' }}>{ringPct}%</span>
                  <span style={{ fontSize: 8, color: '#9494b8', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 5 }}>geral</span>
                </div>
              </div>

              {/* Stat pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { val: total,           label: 'total de aulas', color: '#fafafa' },
                  { val: completed,       label: 'concluídas',     color: '#31A8FF' },
                  { val: total-completed, label: 'restantes',      color: '#FF9A00' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '9px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color, minWidth: 44, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.val}</span>
                    <span style={{ fontSize: 10, color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10">
        {/* Aurora na seção de conteúdo */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.2) 0%, transparent 60%)', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', top: '20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(49,168,255,0.15) 0%, transparent 60%)', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '0%', left: '20%', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,119,255,0.1) 0%, transparent 60%)', filter: 'blur(80px)' }} />
        </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">

        {/* Cabeçalho da seção */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <div className="w-0.5 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #31A8FF, #9333ea)' }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: '#fafafa' }}>
              Trilhas Criativas
            </span>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full font-medium" style={{ color: '#9494b8', background: 'rgba(18,18,26,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {modules.length} módulos
          </span>
        </div>

        {/* Continue de onde parou */}
        {(() => {
          const inProgress = modules.find(m => {
            const mp = progress?.modules.find(mp => mp.moduleId === m.id);
            return mp && mp.progressPercentage > 0 && mp.progressPercentage < 100;
          });
          if (!inProgress) return null;
          const t = getToolForModule(inProgress.title, modules.indexOf(inProgress));
          const mp = progress?.modules.find(mp => mp.moduleId === inProgress.id);
          return (
            <div
              className="mb-5 p-4 rounded-2xl cursor-pointer animate-fade-in-up flex items-center justify-between gap-4"
              style={{ background: `linear-gradient(135deg, ${t.dark}99, rgba(5,5,9,0.5))`, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: `1px solid ${t.color}44`, boxShadow: `0 4px 20px ${t.color}15, inset 0 1px 0 rgba(255,255,255,0.05)`, animationDelay: '0.15s', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onClick={() => navigate(`/module/${inProgress.id}`)}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${t.color}1a`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${t.color}0d`; }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: t.color + '1a', border: `1px solid ${t.color}33` }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: t.color }}>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold mb-0.5" style={{ color: t.color }}>Continuar assistindo</p>
                  <p className="text-sm font-bold" style={{ color: '#fafafa' }}>{inProgress.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-xl font-black leading-none" style={{ color: t.color }}>{mp?.progressPercentage}%</p>
                  <p className="text-[9px] mt-0.5 uppercase tracking-wider" style={{ color: '#9494b8' }}>concluído</p>
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: t.color + 'aa' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          );
        })()}

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
                className="rounded-2xl overflow-hidden cursor-pointer group animate-fade-in-up card-shimmer"
                style={{ background: 'rgba(14,14,22,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderTop: `2px solid ${tool.color}55`, boxShadow: '0 4px 24px rgba(0,0,0,0.5)', animationDelay: `${index * 0.12}s`, transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s cubic-bezier(0.22,1,0.36,1), border-color 0.45s ease' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = tool.color + '44';
                  (e.currentTarget as HTMLDivElement).style.borderTopColor = tool.color;
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.65), 0 0 40px ${tool.color}18`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e2e';
                  (e.currentTarget as HTMLDivElement).style.borderTopColor = tool.color + '55';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)';
                }}
              >
                {/* Header do card */}
                <div className="p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${tool.dark}cc, rgba(5,5,9,0.5) 80%)`, borderBottom: `1px solid ${tool.color}22` }}>

                  {/* Abreviação Adobe grande no fundo */}
                  <span
                    className="absolute right-2 bottom-0 text-[88px] font-black leading-none select-none"
                    style={{ color: tool.color, opacity: 0.13, fontFamily: 'monospace', letterSpacing: '-0.04em' }}
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
                    <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: tool.color + '1a', border: `1px solid ${tool.color}33` }}>
                        <span className="text-[11px] font-black" style={{ color: tool.color, fontFamily: 'monospace' }}>{tool.abbr}</span>
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-wide" style={{ color: tool.color, opacity: 0.7 }}>{tool.name.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Corpo */}
                <div className="px-5 py-4" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
                  <p className="text-xs mb-4 line-clamp-2 leading-relaxed" style={{ color: '#9494b8' }}>
                    {module.description}
                  </p>

                  {/* Progresso */}
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: '#fafafa' }}>
                      {mp?.completedVideos ?? 0} / {mp?.totalVideos ?? module.videos.length} aulas
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: tool.color }}>{modPct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full mb-4" style={{ background: '#1a1a25' }}>
                    <div className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${modPct}%`, background: `linear-gradient(90deg,${tool.color},${tool.dark})` }} />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px]" style={{ color: '#6b6b8a' }}>
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

                    <span className="text-[11px] font-bold flex items-center gap-1 px-3 py-1 rounded-full transition-all group-hover:gap-1.5"
                      style={{ color: tool.color, background: tool.color + '18', border: `1px solid ${tool.color}33` }}>
                      Ver módulo
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
    </div>
  );
};

export default Dashboard;
