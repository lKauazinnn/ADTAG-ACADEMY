import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';

const smColors: Record<number, { color: string; dark: string; abbr: string }> = {
  10: { color: '#E1306C', dark: '#5c0e27', abbr: 'IG' },
  11: { color: '#69C9D0', dark: '#0c3a3d', abbr: 'TK' },
  12: { color: '#FF9A00', dark: '#5c3600', abbr: 'CP' },
  13: { color: '#FF3333', dark: '#5c0000', abbr: 'YT' },
  14: { color: '#9333ea', dark: '#3b1060', abbr: 'SM' },
  15: { color: '#31C5F4', dark: '#0b4458', abbr: 'MT' },
};
const fallback = { color: '#E1306C', dark: '#5c0e27', abbr: 'SM' };
const creativeSuiteTools = [
  { abbr: 'Ps', color: '#31A8FF' },
  { abbr: 'Pr', color: '#EA77FF' },
  { abbr: 'Ai', color: '#FF9A00' },
  { abbr: 'Ae', color: '#9999FF' },
  { abbr: 'Lr', color: '#31C5F4' },
  { abbr: 'Id', color: '#FF3870' },
];

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  videos: { id: string; title: string; duration: number }[];
}

const SocialMedia: React.FC = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem('currentCategory', 'social');
    api.get('/modules?category=social').then(r => setModules(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalAulas = modules.reduce((acc, m) => acc + m.videos.length, 0);
  const featuredMod = modules[0];
  const fs = featuredMod ? (smColors[featuredMod.order] ?? fallback) : fallback;

  if (loading) return (
    <div className="min-h-screen" style={{ background: '#050509' }}>
      <Header />
      <div className="flex items-center justify-center h-96">
        <div className="w-7 h-7 border-[3px] border-t-transparent rounded-full animate-spin" style={{ borderColor: '#E1306C', borderTopColor: 'transparent' }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#050509' }}>
      <div className="pointer-events-none fixed inset-0 z-0" style={{ overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 110% 70% at 85% -10%, rgba(225,48,108,0.2), transparent 55%), radial-gradient(ellipse 90% 80% at -10% 65%, rgba(147,51,234,0.2), transparent 55%)' }} />
        <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,48,108,0.16) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-15%', width: 1000, height: 1000, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.16) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '64px 64px', WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 20%, transparent 80%)', maskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 20%, transparent 80%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)' }} />
      </div>
      <div className="pointer-events-none fixed inset-0 z-0" style={{ backgroundImage: 'url(/marca-dagua.png)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '38%', opacity: 0.018, filter: 'invert(1)' }} />

      <Header />

      {/* Hero */}
      <div className="relative z-10 overflow-hidden" style={{ background: 'rgba(5,5,12,0.55)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute" style={{ inset: 0, background: 'radial-gradient(ellipse 110% 90% at 95% 10%, rgba(225,48,108,0.28), transparent 55%)' }} />
          <div className="absolute" style={{ inset: 0, background: 'radial-gradient(ellipse 90% 110% at -5% 95%, rgba(147,51,234,0.22), transparent 55%)' }} />
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(225,48,108,0.5), rgba(147,51,234,0.5), transparent)' }} />
        </div>
        <div className="max-w-5xl mx-auto px-6 py-14 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#E1306C', boxShadow: '0 0 10px #E1306C, 0 0 24px rgba(225,48,108,0.5)' }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#E1306C' }}>Creative Studio · ADTAG</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, color: '#fafafa', marginBottom: '0.75rem' }}>
                Trilha Social Media
              </h1>
              <p style={{ color: '#9494b8', fontSize: '0.875rem', maxWidth: 360, lineHeight: 1.7, marginBottom: '0.9rem' }}>
                Domine Instagram, TikTok, YouTube, Copy e muito mais
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {creativeSuiteTools.map(tool => (
                  <span key={tool.abbr} className="text-[10px] font-black px-2.5 py-1 rounded-lg"
                    style={{ fontFamily: 'monospace', color: tool.color, background: tool.color + '12', border: `1px solid ${tool.color}33` }}>
                    {tool.abbr}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => featuredMod && navigate(`/module/${featuredMod.id}`)} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'linear-gradient(135deg, #E1306C, #9333ea)', color: '#fff', boxShadow: '0 4px 20px rgba(225,48,108,0.35)' }}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Começar trilha
                </button>
                <span className="text-[10px] px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#9494b8' }}>
                  {modules.length} módulos · {totalAulas} aulas
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {[{ val: modules.length, label: 'módulos', color: '#fafafa' }, { val: totalAulas, label: 'aulas', color: '#E1306C' }, { val: '20h+', label: 'conteúdo', color: '#FF9A00' }].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '9px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color, minWidth: 36, lineHeight: 1 }}>{s.val}</span>
                  <span style={{ fontSize: 10, color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* Destaque */}
        {featuredMod && (
          <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-0.5 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #E1306C, #9333ea)' }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: '#fafafa' }}>Módulo em Destaque</span>
            </div>
            <div className="rounded-2xl overflow-hidden relative cursor-pointer" style={{ background: 'rgba(14,14,22,0.9)', border: `1px solid ${fs.color}33`, boxShadow: `0 8px 48px ${fs.color}18`, transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease' }}
              onClick={() => navigate(`/module/${featuredMod.id}`)}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${fs.color}25`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 48px ${fs.color}18`; }}
            >
              <div style={{ height: 3, background: `linear-gradient(90deg, ${fs.color}, #9333ea, #69C9D0)` }} />
              <span className="absolute right-4 bottom-0 text-[160px] font-black leading-none select-none pointer-events-none" style={{ color: fs.color, opacity: 0.07, fontFamily: 'monospace' }}>{fs.abbr}</span>
              <div className="p-7 relative z-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: fs.color + '22', border: `1px solid ${fs.color}44` }}>
                      <span className="text-sm font-black" style={{ color: fs.color, fontFamily: 'monospace' }}>{fs.abbr}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: fs.color }}>Social Media</p>
                      <p className="text-[10px]" style={{ color: '#6b6b8a' }}>Módulo mais acessado</p>
                    </div>
                  </div>
                  <h2 className="text-xl font-black mb-2" style={{ color: '#fafafa', letterSpacing: '-0.02em' }}>{featuredMod.title}</h2>
                  <p className="text-sm mb-5 leading-relaxed" style={{ color: '#9494b8', maxWidth: 420 }}>{featuredMod.description}</p>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: `linear-gradient(135deg, ${fs.color}, ${fs.dark})`, color: '#fff', boxShadow: `0 4px 20px ${fs.color}44` }} onClick={e => { e.stopPropagation(); navigate(`/module/${featuredMod.id}`); }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    Iniciar módulo
                  </button>
                </div>
                <div className="flex md:flex-col gap-3 md:gap-4 md:justify-center">
                  {[{ icon: '🎬', val: featuredMod.videos.length, label: 'Aulas' }, { icon: '⭐', val: '4.9', label: 'Avaliação' }].map(s => (
                    <div key={s.label} className="flex flex-col items-center justify-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', minWidth: 90 }}>
                      <span className="text-base mb-0.5">{s.icon}</span>
                      <span className="text-lg font-black" style={{ color: fs.color, lineHeight: 1 }}>{s.val}</span>
                      <span className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: '#6b6b8a' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-0.5 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #E1306C, #9333ea)' }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: '#fafafa' }}>Todos os Módulos</span>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full font-medium" style={{ color: '#9494b8', background: 'rgba(18,18,26,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {modules.length} módulos disponíveis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod, index) => {
            const s = smColors[mod.order] ?? fallback;
            return (
              <div key={mod.id} className="rounded-2xl overflow-hidden animate-fade-in-up card-shimmer cursor-pointer"
                style={{ background: 'rgba(14,14,22,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderTop: `2px solid ${s.color}55`, boxShadow: '0 4px 24px rgba(0,0,0,0.5)', animationDelay: `${index * 0.12}s`, transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease' }}
                onClick={() => navigate(`/module/${mod.id}`)}
                onMouseEnter={e => { setHoveredCard(mod.id); (e.currentTarget as HTMLDivElement).style.borderTopColor = s.color; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.65), 0 0 40px ${s.color}18`; }}
                onMouseLeave={e => { setHoveredCard(null); (e.currentTarget as HTMLDivElement).style.borderTopColor = s.color + '55'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)'; }}
              >
                <div className="p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${s.dark}cc, rgba(5,5,9,0.5) 80%)`, borderBottom: `1px solid ${s.color}22` }}>
                  <span className="absolute right-2 bottom-0 text-[88px] font-black leading-none select-none" style={{ color: s.color, opacity: 0.13, fontFamily: 'monospace' }}>{s.abbr}</span>
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <h3 className="font-bold text-sm leading-snug" style={{ color: '#fafafa' }}>{mod.title}</h3>
                    </div>
                    <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: s.color + '1a', border: `1px solid ${s.color}33` }}>
                      <span className="text-[11px] font-black" style={{ color: s.color, fontFamily: 'monospace' }}>{s.abbr}</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs mb-4 line-clamp-2 leading-relaxed" style={{ color: '#9494b8' }}>{mod.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] flex items-center gap-1" style={{ color: '#6b6b8a' }}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
                      {mod.videos.length} aulas
                    </span>
                    <span className="text-[11px] font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ color: hoveredCard === mod.id ? '#fff' : s.color, background: hoveredCard === mod.id ? s.color : s.color + '18', border: `1px solid ${s.color}44` }}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      Acessar
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="mt-14 pb-4 text-center">
          <div className="inline-flex flex-col items-center gap-2">
            <img src="/logo.png" alt="ADTAG" className="h-6 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
            <p className="text-[10px]" style={{ color: '#6b6b8a' }}>© 2026 · Creative Studio UNIDOS – Juventude ADTAG</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SocialMedia;
