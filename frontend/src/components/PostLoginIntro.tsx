import React, { useEffect, useMemo, useState } from 'react';

interface PostLoginIntroProps {
  onFinish: () => void;
  userName?: string;
  readyToExit?: boolean;
}

const TECH_LINES = [
  { top: '24%', delay: 0.08 },
  { top: '34%', delay: 0.14 },
  { top: '66%', delay: 0.2 },
  { top: '76%', delay: 0.26 },
];

const PostLoginIntro: React.FC<PostLoginIntroProps> = ({ onFinish, userName, readyToExit = true }) => {
  const [exiting, setExiting] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(max-width: 768px)').matches;
  }, []);

  const shortName = (userName?.split(' ')[0] || 'Criador').trim();

  useEffect(() => {
    const minimumDuration = reducedMotion ? 320 : 1550;
    const timer = setTimeout(() => setMinElapsed(true), minimumDuration);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (!minElapsed || !readyToExit || exiting) return;
    setExiting(true);
  }, [exiting, minElapsed, readyToExit]);

  useEffect(() => {
    if (!exiting) return;
    const exitDuration = reducedMotion ? 120 : 340;
    const timer = setTimeout(() => onFinish(), exitDuration);
    return () => clearTimeout(timer);
  }, [exiting, onFinish, reducedMotion]);

  return (
    <>
      <style>{`
        @keyframes pli-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pli-fade-out { from { opacity: 1 } to { opacity: 0 } }

        @keyframes pli-panel-in-left {
          0% { transform: translateX(-102%); }
          100% { transform: translateX(0); }
        }
        @keyframes pli-panel-in-right {
          0% { transform: translateX(102%); }
          100% { transform: translateX(0); }
        }

        @keyframes pli-line-scan {
          0% { transform: scaleX(0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: scaleX(1); opacity: 0.35; }
        }

        @keyframes pli-headline {
          0% { opacity: 0; transform: translateY(18px); letter-spacing: .12em; }
          100% { opacity: 1; transform: translateY(0); letter-spacing: .03em; }
        }


        @keyframes pli-subline {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes pli-progress {
          0% { transform: scaleX(0); }
          38% { transform: scaleX(0.42); }
          72% { transform: scaleX(0.78); }
          100% { transform: scaleX(1); }
        }

        @keyframes pli-accent {
          0%, 100% { opacity: .4; }
          50% { opacity: .95; }
        }

        @keyframes pli-curtain-up {
          from { clip-path: inset(0 0 0 0); }
          to { clip-path: inset(0 0 100% 0); }
        }

        .pli-root {
          animation: pli-fade-in 160ms ease forwards;
          will-change: opacity, clip-path;
        }
        .pli-root.pli-exit {
          animation:
            pli-curtain-up 300ms cubic-bezier(.76,0,.24,1) forwards,
            pli-fade-out 340ms ease forwards;
        }

        .pli-panel-left {
          animation: pli-panel-in-left 700ms cubic-bezier(.22,1,.36,1) forwards;
          will-change: transform;
        }
        .pli-panel-right {
          animation: pli-panel-in-right 700ms cubic-bezier(.22,1,.36,1) forwards;
          will-change: transform;
        }

        .pli-line {
          transform-origin: left center;
          animation: pli-line-scan 740ms cubic-bezier(.16,1,.3,1) forwards;
          will-change: transform, opacity;
        }

        .pli-headline {
          opacity: 0;
          animation: pli-headline 620ms cubic-bezier(.22,1,.36,1) 300ms forwards;
          will-change: transform, opacity, letter-spacing;
        }

        .pli-subline {
          opacity: 0;
          animation: pli-subline 520ms cubic-bezier(.22,1,.36,1) 520ms forwards;
          will-change: transform, opacity;
        }

        .pli-progress-fill {
          transform: scaleX(0);
          transform-origin: left center;
          animation: pli-progress 1.45s cubic-bezier(.16,1,.3,1) 220ms forwards;
          will-change: transform;
        }

        .pli-accent-dot {
          animation: pli-accent 1.5s ease-in-out .4s infinite;
        }

        @media (max-width: 768px) {
          .pli-heavy { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pli-panel-left,
          .pli-panel-right,
          .pli-line,
          .pli-headline,
          .pli-subline,
          .pli-progress-fill,
          .pli-accent-dot {
            animation-duration: 120ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}</style>

      <div
        className={`pli-root ${exiting ? 'pli-exit' : ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#06070b',
          overflow: 'hidden',
        }}
      >
        <div
          className="pli-heavy"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 80% 45% at 50% 35%, rgba(49,168,255,.12), transparent 70%), radial-gradient(ellipse 90% 52% at 50% 70%, rgba(147,51,234,.12), transparent 72%)',
          }}
        />

        <div
          className="pli-panel-left"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(10,13,20,.88), rgba(10,13,20,.22), transparent)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="pli-panel-right"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(270deg, rgba(10,13,20,.88), rgba(10,13,20,.22), transparent)',
            pointerEvents: 'none',
          }}
        />

        {!isMobile &&
          TECH_LINES.map((line, index) => (
            <div
              key={index}
              className="pli-line"
              style={{
                position: 'absolute',
                left: '8%',
                right: '8%',
                top: line.top,
                height: 1,
                background:
                  index % 2 === 0
                    ? 'linear-gradient(90deg, transparent, rgba(49,168,255,.8), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(147,51,234,.78), transparent)',
                opacity: 0,
                animationDelay: `${line.delay}s`,
                pointerEvents: 'none',
              }}
            />
          ))}

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: 'min(92vw, 700px)',
            textAlign: 'center',
            padding: isMobile ? '0 14px' : 0,
          }}
        >
          <p
            className="pli-subline"
            style={{
              color: '#6b7794',
              fontSize: 10,
              letterSpacing: '.24em',
              textTransform: 'uppercase',
              marginBottom: 14,
              fontWeight: 700,
            }}
          >
            ADTAG • PLATAFORMA CRIATIVA
          </p>

          <h1
            className="pli-headline"
            style={{
              margin: 0,
              fontSize: 'clamp(1.95rem, 7vw, 4.2rem)',
              lineHeight: 1,
              fontWeight: 900,
              color: '#f8faff',
              textTransform: 'uppercase',
              textShadow: '0 0 26px rgba(49,168,255,.15)',
            }}
          >
            Acesso autorizado
          </h1>

          <p
            className="pli-subline"
            style={{
              marginTop: 12,
              marginBottom: 14,
              color: '#94a0bb',
              fontSize: 'clamp(.76rem, 2.5vw, .88rem)',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Bem-vindo, {shortName}
          </p>

          <p
            className="pli-subline"
            style={{
              marginTop: 0,
              marginBottom: 18,
              color: '#6f7b98',
              fontSize: 11,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              animationDelay: '0.52s',
            }}
          >
            Preparando ambiente criativo
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              className="pli-accent-dot"
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#31A8FF',
                boxShadow: '0 0 10px rgba(49,168,255,.7)',
              }}
            />
            <span
              className="pli-subline"
              style={{
                color: '#6f7b98',
                fontSize: 10,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
              }}
            >
              Carregando experiência
            </span>
          </div>

          <div
            style={{
              height: 3,
              borderRadius: 999,
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.08)',
              overflow: 'hidden',
            }}
          >
            <div
              className="pli-progress-fill"
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #31A8FF, #9333ea, #EA77FF)',
              }}
            />
          </div>
        </div>

        <div
          className="pli-heavy"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(49,168,255,.35), transparent)',
          }}
        />
        <div
          className="pli-heavy"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(147,51,234,.35), transparent)',
          }}
        />
      </div>
    </>
  );
};

export default PostLoginIntro;
