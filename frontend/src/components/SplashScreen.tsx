import React, { useEffect, useState } from 'react';

// Poucas partículas, posições fixas (sem recalcular blur em loop)
const PARTICLES = [
  { top: '18%', left: '12%',  size: 3, delay: 0,    dur: 3.2, color: 'rgba(168,85,247,.7)'  },
  { top: '72%', left: '8%',   size: 2, delay: 0.4,  dur: 2.8, color: 'rgba(236,72,153,.6)'  },
  { top: '35%', left: '88%',  size: 3, delay: 0.8,  dur: 3.6, color: 'rgba(49,168,255,.55)' },
  { top: '80%', left: '82%',  size: 2, delay: 0.2,  dur: 2.6, color: 'rgba(249,115,22,.5)'  },
  { top: '55%', left: '50%',  size: 2, delay: 1.0,  dur: 4.0, color: 'rgba(168,85,247,.5)'  },
  { top: '15%', left: '65%',  size: 3, delay: 0.6,  dur: 3.0, color: 'rgba(236,72,153,.55)' },
  { top: '90%', left: '45%',  size: 2, delay: 1.2,  dur: 3.4, color: 'rgba(49,168,255,.45)' },
  { top: '42%', left: '22%',  size: 2, delay: 0.3,  dur: 2.9, color: 'rgba(168,85,247,.45)' },
];

interface Props {
  onFinish: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2300);
    const t2 = setTimeout(() => onFinish(), 3050);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onFinish]);

  const letters = [
    { ch: 'A', grad: 'linear-gradient(135deg,#fff 0%,#a855f7 100%)' },
    { ch: 'D', grad: 'linear-gradient(135deg,#f0f0ff 0%,#c084fc 100%)' },
    { ch: 'T', grad: 'linear-gradient(135deg,#f0f0ff 0%,#9494b8 100%)' },
    { ch: 'A', grad: 'linear-gradient(135deg,#f0f0ff 0%,#9494b8 100%)' },
    { ch: 'G', grad: 'linear-gradient(135deg,#ec4899 0%,#f97316 100%)' },
  ];

  return (
    <>
      <style>{`
        @keyframes sp-fade-in  { from{opacity:0} to{opacity:1} }
        @keyframes sp-exit-up  { 0%{transform:translateY(0)} 100%{transform:translateY(-100%)} }

        /* Orbs: só opacity — GPU-only, zero recalculate */
        @keyframes sp-orb-pulse {
          0%,100%{opacity:.7} 50%{opacity:1}
        }

        @keyframes sp-letter {
          0%  { opacity:0; transform:translateY(-60px) rotateX(80deg); }
          55% { opacity:1; transform:translateY(4px)  rotateX(-4deg); }
          100%{ opacity:1; transform:translateY(0)    rotateX(0deg);  }
        }

        @keyframes sp-subtitle {
          0%  { opacity:0; transform:translateY(10px); }
          100%{ opacity:1; transform:translateY(0); }
        }

        @keyframes sp-glow {
          0%,100%{ text-shadow:0 0 28px rgba(168,85,247,.5),0 0 55px rgba(168,85,247,.2); }
          50%    { text-shadow:0 0 48px rgba(168,85,247,.9),0 0 95px rgba(168,85,247,.4); }
        }

        @keyframes sp-bar {
          0%  {width:0%}
          20% {width:14%}
          55% {width:58%}
          82% {width:82%}
          100%{width:100%}
        }

        /* Scan usa transform em vez de top — muito mais rápido */
        @keyframes sp-scan {
          0%  { opacity:0; transform:translateY(0vh); }
          6%  { opacity:1; }
          94% { opacity:1; }
          100%{ opacity:0; transform:translateY(100vh); }
        }

        @keyframes sp-particle {
          0%,100%{ transform:translateY(0)    opacity:.4; opacity:.4; }
          50%    { transform:translateY(-13px);           opacity:1;  }
        }

        @keyframes sp-dot {
          0%,100%{ opacity:.3; transform:scale(1);   }
          50%    { opacity:1;  transform:scale(1.8); }
        }

        .sp-letter-glow { animation: sp-glow 1.8s ease-in-out 0.9s infinite; }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0d12',
          overflow: 'hidden',
          willChange: 'transform',
          animation: exiting
            ? 'sp-exit-up 0.75s cubic-bezier(0.76,0,0.24,1) forwards'
            : 'sp-fade-in 0.3s ease forwards',
        }}
      >
        {/* ── Orbs estáticos com blur — NÃO animam transform, só opacity ── */}
        <div style={{
          position: 'absolute', top: '5%', left: '10%',
          width: 460, height: 460, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(168,85,247,.3) 0%,transparent 65%)',
          filter: 'blur(60px)',
          animation: 'sp-orb-pulse 4s ease-in-out infinite',
          willChange: 'opacity',
        }} />
        <div style={{
          position: 'absolute', bottom: '8%', right: '8%',
          width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(236,72,153,.24) 0%,transparent 65%)',
          filter: 'blur(55px)',
          animation: 'sp-orb-pulse 5s ease-in-out 1s infinite',
          willChange: 'opacity',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '28%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(49,168,255,.18) 0%,transparent 65%)',
          filter: 'blur(50px)',
          animation: 'sp-orb-pulse 6s ease-in-out 2s infinite',
          willChange: 'opacity',
        }} />

        {/* ── Grid (sem animação) ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)
          `,
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%,black,transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%,black,transparent)',
          pointerEvents: 'none',
        }} />

        {/* ── Scan line — usa transform ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg,transparent,rgba(168,85,247,.75) 40%,rgba(236,72,153,.75) 60%,transparent)',
          animation: 'sp-scan 2s ease-in-out 0.3s forwards',
          opacity: 0,
          willChange: 'transform, opacity',
          pointerEvents: 'none',
        }} />

        {/* ── Partículas (só transform + opacity) ── */}
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: p.top, left: p.left,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `sp-particle ${p.dur}s ease-in-out ${p.delay}s infinite`,
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }} />
        ))}

        {/* ── Logo ── */}
        <div
          className="sp-letter-glow"
          style={{ display: 'flex', gap: '0.1em', perspective: '600px' }}
        >
          {letters.map((l, i) => (
            <span key={i} style={{
              fontSize: 'clamp(58px, 11vw, 92px)',
              fontWeight: 900,
              lineHeight: 1,
              background: l.grad,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
              opacity: 0,
              willChange: 'transform, opacity',
              animation: `sp-letter 0.6s cubic-bezier(0.22,1,0.36,1) ${0.36 + i * 0.09}s forwards`,
            }}>
              {l.ch}
            </span>
          ))}
        </div>

        {/* ── Subtitle ── */}
        <div style={{
          marginTop: 18,
          fontSize: 11,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#55557a',
          fontWeight: 500,
          opacity: 0,
          willChange: 'transform, opacity',
          animation: 'sp-subtitle 0.55s cubic-bezier(0.22,1,0.36,1) 1s forwards',
        }}>
          Plataforma de Aprendizado
        </div>

        {/* ── Corner dots ── */}
        {[
          { top: 24, left: 24 },
          { top: 24, right: 24 },
          { bottom: 24, left: 24 },
          { bottom: 24, right: 24 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', ...pos,
            width: 5, height: 5, borderRadius: '50%',
            background: i % 2 === 0 ? '#a855f7' : '#ec4899',
            boxShadow: i % 2 === 0 ? '0 0 8px rgba(168,85,247,.9)' : '0 0 8px rgba(236,72,153,.9)',
            animation: `sp-dot 1.8s ease-in-out ${i * 0.25}s infinite`,
            willChange: 'transform, opacity',
          }} />
        ))}

        {/* ── Progress bar ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: 'rgba(255,255,255,.04)',
        }}>
          <div style={{
            height: '100%', width: 0,
            background: 'linear-gradient(90deg,#a855f7,#ec4899,#f97316)',
            boxShadow: '0 0 10px rgba(168,85,247,.6)',
            willChange: 'width',
            animation: 'sp-bar 2.2s cubic-bezier(0.16,1,0.3,1) 0.1s forwards',
          }} />
        </div>
      </div>
    </>
  );
};

export default SplashScreen;
