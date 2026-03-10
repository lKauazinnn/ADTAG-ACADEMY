import React from 'react';
import Header from '../components/Header';

const smModules = [
  {
    abbr: 'IG',
    name: 'Instagram',
    title: 'Instagram para Negócios',
    description: 'Feed estratégico, Reels virais, Stories que convertem e como crescer do zero com consistência.',
    aulas: 18,
    horas: '4h 30min',
    color: '#E1306C',
    dark: '#5c0e27',
  },
  {
    abbr: 'TK',
    name: 'TikTok',
    title: 'TikTok & Reels — Conteúdo Viral',
    description: 'Criação de vídeos curtos de alto impacto, tendências, hooks e edições que retêm atenção.',
    aulas: 14,
    horas: '3h 20min',
    color: '#69C9D0',
    dark: '#0c3a3d',
  },
  {
    abbr: 'CP',
    name: 'Copy',
    title: 'Copywriting para Redes Sociais',
    description: 'Textos que vendem, legendas que engajam, CTAs irresistíveis e estratégias de storytelling.',
    aulas: 12,
    horas: '2h 50min',
    color: '#FF9A00',
    dark: '#5c3600',
  },
  {
    abbr: 'YT',
    name: 'YouTube',
    title: 'YouTube — Do Zero ao Canal',
    description: 'SEO para YouTube, miniaturas que clicam, roteiros, edição e monetização do canal.',
    aulas: 20,
    horas: '5h 10min',
    color: '#FF3333',
    dark: '#5c0000',
  },
  {
    abbr: 'SM',
    name: 'Estratégia',
    title: 'Estratégia & Gestão de Comunidade',
    description: 'Planejamento de conteúdo, calendário editorial, gestão de comentários e crescimento orgânico.',
    aulas: 10,
    horas: '2h 20min',
    color: '#9333ea',
    dark: '#3b1060',
  },
  {
    abbr: 'MT',
    name: 'Métricas',
    title: 'Métricas & Analytics',
    description: 'Leitura de dados, KPIs que importam, relatórios para clientes e otimização de performance.',
    aulas: 8,
    horas: '1h 50min',
    color: '#31C5F4',
    dark: '#0b4458',
  },
];

const SocialMedia: React.FC = () => {
  const totalAulas = smModules.reduce((acc, m) => acc + m.aulas, 0);

  return (
    <div className="min-h-screen" style={{ background: '#050509' }}>

      {/* ── Background atmosférico ── */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 110% 70% at 85% -10%, rgba(225,48,108,0.2), transparent 55%), radial-gradient(ellipse 90% 80% at -10% 65%, rgba(147,51,234,0.2), transparent 55%), radial-gradient(ellipse 70% 60% at 50% 110%, rgba(105,201,208,0.1), transparent 55%)' }} />
        <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,48,108,0.16) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-15%', width: 1000, height: 1000, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.16) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(105,201,208,0.08) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 20%, transparent 80%)',
          maskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 20%, transparent 80%)',
        }} />
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
          <div className="absolute" style={{ inset: 0, background: 'radial-gradient(ellipse 110% 90% at 95% 10%, rgba(225,48,108,0.28), transparent 55%)' }} />
          <div className="absolute" style={{ inset: 0, background: 'radial-gradient(ellipse 90% 110% at -5% 95%, rgba(147,51,234,0.22), transparent 55%)' }} />
          <div className="absolute" style={{ inset: 0, background: 'radial-gradient(ellipse 60% 60% at 55% 120%, rgba(105,201,208,0.1), transparent 55%)' }} />
          {/* Bottom glow edge */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(225,48,108,0.5), rgba(147,51,234,0.5), rgba(105,201,208,0.4), transparent)' }} />
        </div>
        {/* Grid */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '58px 58px',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 100% at 50% 0%, black 30%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 90% 100% at 50% 0%, black 30%, transparent 100%)',
        }} />

        <div className="max-w-5xl mx-auto px-6 py-14 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">

            {/* Título */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#E1306C', boxShadow: '0 0 10px #E1306C, 0 0 24px rgba(225,48,108,0.5)' }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#E1306C' }}>Creative Studio · ADTAG</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, color: '#fafafa', marginBottom: '0.75rem' }}>
                Trilha Social Media
              </h1>
              <p style={{ color: '#9494b8', fontSize: '0.875rem', maxWidth: 360, lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Domine Instagram, TikTok, YouTube, Copy e muito mais
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: '#EA77FF14', border: '1px solid #EA77FF44' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#EA77FF' }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#EA77FF' }}>Em breve</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              {[
                { val: smModules.length, label: 'módulos',  color: '#fafafa' },
                { val: totalAulas,       label: 'aulas',    color: '#E1306C' },
                { val: '20h+',           label: 'conteúdo', color: '#FF9A00' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '9px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color, minWidth: 36, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.val}</span>
                  <span style={{ fontSize: 10, color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700 }}>{s.label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10">
        {/* Aurora atrás dos cards */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,48,108,0.15) 0%, transparent 60%)', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', top: '20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 60%)', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '0%', left: '20%', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(105,201,208,0.08) 0%, transparent 60%)', filter: 'blur(80px)' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">

          {/* Cabeçalho da seção */}
          <div className="flex items-center justify-between mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="w-0.5 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #E1306C, #9333ea)' }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: '#fafafa' }}>
                Módulos da Trilha
              </span>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full font-medium" style={{ color: '#9494b8', background: 'rgba(18,18,26,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {smModules.length} módulos
            </span>
          </div>

          {/* Grid de cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {smModules.map((mod, index) => (
              <div
                key={mod.abbr}
                className="rounded-2xl overflow-hidden group animate-fade-in-up card-shimmer"
                style={{ background: 'rgba(14,14,22,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderTop: `2px solid ${mod.color}55`, boxShadow: '0 4px 24px rgba(0,0,0,0.5)', animationDelay: `${index * 0.12}s`, cursor: 'default', transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s cubic-bezier(0.22,1,0.36,1), border-color 0.45s ease' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = mod.color + '44';
                  (e.currentTarget as HTMLDivElement).style.borderTopColor = mod.color;
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.65), 0 0 40px ${mod.color}18`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLDivElement).style.borderTopColor = mod.color + '55';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)';
                }}
              >
                {/* Header */}
                <div className="p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${mod.dark}cc, rgba(5,5,9,0.5) 80%)`, borderBottom: `1px solid ${mod.color}22` }}>
                  {/* Abreviação grande no fundo */}
                  <span className="absolute right-2 bottom-0 text-[88px] font-black leading-none select-none"
                    style={{ color: mod.color, opacity: 0.13, fontFamily: 'monospace', letterSpacing: '-0.04em' }}>
                    {mod.abbr}
                  </span>

                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3 uppercase tracking-wider"
                        style={{ background: `${mod.color}18`, color: mod.color, border: `1px solid ${mod.color}44` }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: mod.color }} />
                        Em breve
                      </span>
                      <h3 className="font-bold text-sm leading-snug" style={{ color: '#fafafa' }}>{mod.title}</h3>
                    </div>
                    {/* Badge abbr */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: mod.color + '1a', border: `1px solid ${mod.color}33` }}>
                        <span className="text-[11px] font-black" style={{ color: mod.color, fontFamily: 'monospace' }}>{mod.abbr}</span>
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-wide" style={{ color: mod.color, opacity: 0.7 }}>{mod.name}</span>
                    </div>
                  </div>
                </div>

                {/* Corpo */}
                <div className="px-5 py-4">
                  <p className="text-xs mb-4 line-clamp-2 leading-relaxed" style={{ color: '#9494b8' }}>
                    {mod.description}
                  </p>

                  {/* Barra de progresso */}
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: '#fafafa' }}>
                      0 / {mod.aulas} aulas
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: mod.color }}>0%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full mb-4" style={{ background: '#1a1a25' }}>
                    <div className="h-1.5 rounded-full w-0" style={{ background: `linear-gradient(90deg,${mod.color},${mod.dark})` }} />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px]" style={{ color: '#6b6b8a' }}>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {mod.horas}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                        {mod.aulas} aulas
                      </span>
                    </div>
                    <span className="text-[11px] font-bold flex items-center gap-1 px-3 py-1 rounded-full"
                      style={{ color: mod.color, background: mod.color + '18', border: `1px solid ${mod.color}33` }}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Em breve
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-14 pb-4 text-center">
            <div className="inline-flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 mb-1">
                {[{ abbr: 'IG', c: '#E1306C' }, { abbr: 'TK', c: '#69C9D0' }, { abbr: 'YT', c: '#FF3333' }, { abbr: 'CP', c: '#FF9A00' }].map(t => (
                  <span key={t.abbr} className="text-[9px] font-black px-1.5 py-0.5 rounded"
                    style={{ fontFamily: 'monospace', color: t.c, background: t.c + '12', border: `1px solid ${t.c}22` }}>
                    {t.abbr}
                  </span>
                ))}
              </div>
              <img src="/logo.png" alt="ADTAG" className="h-6 w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
              <p className="text-[10px]" style={{ color: '#6b6b8a' }}>© 2026 · Creative Studio UNIDOS – Juventude ADTAG</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
