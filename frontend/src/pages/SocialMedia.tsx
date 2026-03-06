import React from 'react';
import Header from '../components/Header';

const smModules = [
  {
    abbr: 'IG',
    title: 'Instagram para Negócios',
    description: 'Feed estratégico, Reels virais, Stories que convertem e como crescer do zero com consistência.',
    aulas: 18,
    horas: '4h 30min',
    color: '#E1306C',
    dark: '#5c0e27',
  },
  {
    abbr: 'TK',
    title: 'TikTok & Reels — Conteúdo Viral',
    description: 'Criação de vídeos curtos de alto impacto, tendências, hooks e edições que retêm atenção.',
    aulas: 14,
    horas: '3h 20min',
    color: '#69C9D0',
    dark: '#0c3a3d',
  },
  {
    abbr: 'CP',
    title: 'Copywriting para Redes Sociais',
    description: 'Textos que vendem, legendas que engajam, CTAs irresistíveis e estratégias de storytelling.',
    aulas: 12,
    horas: '2h 50min',
    color: '#FF9A00',
    dark: '#5c3600',
  },
  {
    abbr: 'YT',
    title: 'YouTube — Do Zero ao Canal',
    description: 'SEO para YouTube, miniaturas que clicam, roteiros, edição e monetização do canal.',
    aulas: 20,
    horas: '5h 10min',
    color: '#FF3333',
    dark: '#5c0000',
  },
  {
    abbr: 'SM',
    title: 'Estratégia & Gestão de Comunidade',
    description: 'Planejamento de conteúdo, calendário editorial, gestão de comentários e crescimento orgânico.',
    aulas: 10,
    horas: '2h 20min',
    color: '#9333ea',
    dark: '#3b1060',
  },
  {
    abbr: 'MT',
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
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>

      {/* Marca d'água */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage: 'url(/marca-dagua.png)',
        backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '38%',
        opacity: 0.018, filter: 'invert(1)',
      }} />

      {/* Glows ambientais */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute" style={{ top: 0, right: 0, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,48,108,0.07), transparent 65%)' }} />
        <div className="absolute" style={{ bottom: 0, left: 0, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.07), transparent 65%)' }} />
      </div>

      <Header />

      {/* Banner */}
      <div className="relative z-10" style={{ background: '#0f0f14', borderBottom: '1px solid #1e1e2e' }}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* Título */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: '#E1306C' }}>
                Creative Studio · ADTAG
              </p>
              <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: '#fafafa' }}>
                Trilha Social Media
              </h1>
              <p className="text-sm" style={{ color: '#9999bb' }}>
                Domine Instagram, TikTok, YouTube, Copy e muito mais
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              {[
                { val: smModules.length, label: 'Módulos',  color: '#fafafa' },
                { val: totalAulas,       label: 'Aulas',    color: '#E1306C' },
                { val: '20h+',           label: 'Conteúdo', color: '#FF9A00' },
              ].map((s, i, arr) => (
                <React.Fragment key={s.label}>
                  <div className="text-center">
                    <p className="text-xl font-black leading-none" style={{ color: s.color }}>{s.val}</p>
                    <p className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: '#fafafa' }}>{s.label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="w-px self-stretch" style={{ background: '#1e1e2e' }} />}
                </React.Fragment>
              ))}
              {/* Badge Em breve */}
              <div className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#EA77FF14', border: '1px solid #EA77FF44' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#EA77FF' }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#EA77FF' }}>Em breve</span>
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#E1306C' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: '#fafafa' }}>
              Módulos da Trilha
            </span>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full font-medium" style={{ color: '#fafafa', background: '#12121a', border: '1px solid #1e1e2e' }}>
            {smModules.length} módulos
          </span>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smModules.map((mod) => (
            <div
              key={mod.abbr}
              className="rounded-2xl overflow-hidden group transition-all duration-200"
              style={{ background: '#12121a', border: '1px solid #1e1e2e', boxShadow: '0 2px 12px rgba(0,0,0,0.5)', cursor: 'default' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = mod.color + '44';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${mod.color}22`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e2e';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.5)';
              }}
            >
              {/* Header */}
              <div className="p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${mod.dark}, #0a0a0f 80%)`, borderBottom: `1px solid ${mod.color}22` }}>

                {/* Abreviação grande no fundo */}
                <span
                  className="absolute right-3 bottom-0 text-[72px] font-black leading-none select-none"
                  style={{ color: mod.color, opacity: 0.07, fontFamily: 'monospace', letterSpacing: '-0.04em' }}
                >
                  {mod.abbr}
                </span>

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    {/* Badge Em breve */}
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3 uppercase tracking-wider"
                      style={{ background: `${mod.color}18`, color: mod.color, border: `1px solid ${mod.color}44` }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: mod.color }} />
                      Em breve
                    </span>
                    <h3 className="font-bold text-sm leading-snug" style={{ color: '#fafafa' }}>
                      {mod.title}
                    </h3>
                  </div>

                  {/* Badge abbr */}
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: mod.color + '1a', border: `1px solid ${mod.color}33` }}>
                    <span className="text-[11px] font-black" style={{ color: mod.color, fontFamily: 'monospace' }}>{mod.abbr}</span>
                  </div>
                </div>
              </div>

              {/* Corpo */}
              <div className="px-5 py-4">
                <p className="text-xs mb-4 line-clamp-2 leading-relaxed" style={{ color: '#fafafa' }}>
                  {mod.description}
                </p>

                {/* Barra de progresso */}
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: '#fafafa' }}>
                    0 / {mod.aulas} aulas
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: mod.color }}>0%</span>
                </div>
                <div className="w-full h-1 rounded-full mb-4" style={{ background: '#1a1a25' }}>
                  <div className="h-1 rounded-full w-0" style={{ background: `linear-gradient(90deg,${mod.color},${mod.dark})` }} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px]" style={{ color: '#fafafa' }}>
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
                  <span className="text-[11px] font-bold flex items-center gap-1" style={{ color: mod.color }}>
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
            <img src="/logo.png" alt="ADTAG" className="h-6 w-auto object-contain"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
            <p className="text-[10px]" style={{ color: '#fafafa' }}>© 2026 · Creative Studio UNIDOS – Juventude ADTAG</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SocialMedia;
