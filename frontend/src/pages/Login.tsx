import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Badges das ferramentas Adobe no fundo
const toolBadges = [
  { abbr: 'Ps', name: 'Photoshop',   color: '#31A8FF', top: '8%',  left: '6%'  },
  { abbr: 'Pr', name: 'Premiere',    color: '#EA77FF', top: '14%', left: '82%' },
  { abbr: 'Ai', name: 'Illustrator', color: '#FF9A00', top: '72%', left: '8%'  },
  { abbr: 'Ae', name: 'After Effects',color: '#9999FF', top: '78%', left: '80%' },
  { abbr: 'Lr', name: 'Lightroom',   color: '#31C5F4', top: '42%', left: '3%'  },
  { abbr: 'Id', name: 'InDesign',    color: '#FF3870', top: '48%', left: '88%' },
];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      sessionStorage.setItem('postLoginIntro', '1');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden" style={{ background: '#0a0a0f' }}>

      {/* Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute" style={{ top: '-25%', left: '-20%', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(49,168,255,0.3), transparent 65%)' }} />
        <div className="absolute" style={{ bottom: '-30%', right: '-20%', width: 1000, height: 1000, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.3), transparent 65%)' }} />
        <div className="absolute" style={{ top: '35%', left: '35%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,154,0,0.07), transparent 65%)' }} />
        <div className="absolute" style={{ top: '8%', right: '2%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,119,255,0.18), transparent 65%)' }} />
        <div className="absolute" style={{ bottom: '10%', left: '-5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(49,197,244,0.16), transparent 65%)' }} />
        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)' }} />
      </div>

      {/* Grid sutil com mask */}
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
        backgroundSize: '52px 52px',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 50% 50%, black 30%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 80% 100% at 50% 50%, black 30%, transparent 100%)',
      }} />

      {/* Badges flutuantes das ferramentas */}
      {toolBadges.map((t, i) => (
        <div key={t.abbr} className="pointer-events-none absolute select-none animate-float"
          style={{ top: t.top, left: t.left, opacity: 0.28, animationDelay: `${i * 0.6}s` }}>
          <div style={{ width: 70, height: 70, borderRadius: 14, background: t.color + '22', border: `1px solid ${t.color}66`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, boxShadow: `0 0 28px ${t.color}55, 0 0 60px ${t.color}18` }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: t.color, fontFamily: 'monospace', letterSpacing: '-0.02em' }}>{t.abbr}</span>
          </div>
          <p style={{ fontSize: 8, color: t.color, textAlign: 'center', marginTop: 5, fontWeight: 700, letterSpacing: '0.06em', opacity: 0.9 }}>{t.name.toUpperCase()}</p>
        </div>
      ))}

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Gradient border wrapper */}
        <div style={{ padding: 1.5, borderRadius: 20, background: 'linear-gradient(135deg, rgba(49,168,255,0.35), rgba(147,51,234,0.25), rgba(234,119,255,0.35))', boxShadow: '0 0 70px rgba(49,168,255,0.12), 0 0 140px rgba(147,51,234,0.1), 0 50px 120px rgba(0,0,0,0.95)' }}>
        {/* Card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0b0b14' }}>

          {/* Topo colorido */}
          <div className="h-[4px] animate-gradient-shift" style={{ background: 'linear-gradient(90deg,#31A8FF,#9333ea,#EA77FF,#FF9A00,#31A8FF)', backgroundSize: '200% 100%' }} />

          <div className="p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-7">
              <img src="/logo.png" alt="ADTAG" className="h-14 w-auto object-contain mb-4"
                style={{ filter: 'brightness(0) invert(1)' }} />
              <h1 className="text-xl font-bold tracking-tight" style={{ color: '#fafafa' }}>Acesse seu estúdio</h1>
              <p className="text-xs mt-1 text-center" style={{ color: '#fafafa' }}>
                Photoshop · Premiere · After Effects · Illustrator
              </p>
            </div>

            {/* Linha divisória */}
            <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg,transparent,#1e1e2e 30%,#1e1e2e 70%,transparent)' }} />

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-xl text-xs font-medium" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#fafafa' }}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: '#13131e', border: '1px solid #252540', color: '#fafafa' }}
                  onFocus={e => { e.target.style.borderColor = '#31A8FF55'; e.target.style.boxShadow = '0 0 0 3px rgba(49,168,255,0.07)'; }}
                  onBlur={e => { e.target.style.borderColor = '#1e1e2e'; e.target.style.boxShadow = ''; }}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#fafafa' }}>Senha</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: '#13131e', border: '1px solid #252540', color: '#fafafa' }}
                  onFocus={e => { e.target.style.borderColor = '#31A8FF55'; e.target.style.boxShadow = '0 0 0 3px rgba(49,168,255,0.07)'; }}
                  onBlur={e => { e.target.style.borderColor = '#1e1e2e'; e.target.style.boxShadow = ''; }}
                  placeholder="••••••••"
                />
                <div className="mt-2 text-right">
                  <Link to="/reset-password" className="text-[11px] font-semibold transition-colors" style={{ color: '#71c4ffce' }}>
                    Esqueci minha senha
                  </Link>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm tracking-wide disabled:opacity-40 mt-2"
                style={{ background: 'linear-gradient(135deg,#0f4c81,#1a6fb5)', color: '#fff', boxShadow: '0 0 28px hsla(205, 100%, 60%, 0.25)', border: '1px solid #31a8ff4d' }}
                onMouseEnter={e => { if (loading) return; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px hsla(205,100%,60%,0.4), 0 10px 30px rgba(0,0,0,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px hsla(205, 100%, 60%, 0.25)'; }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="text-xs text-center mt-5" style={{ color: '#fafafa' }}>
              Sem conta?{' '}
              <Link to="/register" className="font-bold transition-colors" style={{ color: '#71c4ffce' }}>
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
        </div>{/* fecha gradient border wrapper */}

        <div className="flex flex-col items-center gap-1 mt-4">
          <div className="flex items-center gap-1.5" style={{ color: '#31A8FF', opacity: 0.4 }}>
            <svg width="32" height="8" viewBox="0 0 32 8" fill="none">
              <line x1="0" y1="4" x2="8" y2="4" stroke="currentColor" strokeWidth="1"/>
              <rect x="9" y="2" width="4" height="4" stroke="currentColor" strokeWidth="1"/>
              <line x1="13" y1="4" x2="19" y2="4" stroke="currentColor" strokeWidth="1"/>
              <circle cx="20" cy="4" r="1.5" stroke="currentColor" strokeWidth="1"/>
              <line x1="22" y1="4" x2="32" y2="4" stroke="currentColor" strokeWidth="1"/>
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#31A8FF' }}>versão teste</span>
            <svg width="32" height="8" viewBox="0 0 32 8" fill="none" style={{ transform: 'scaleX(-1)' }}>
              <line x1="0" y1="4" x2="8" y2="4" stroke="currentColor" strokeWidth="1"/>
              <rect x="9" y="2" width="4" height="4" stroke="currentColor" strokeWidth="1"/>
              <line x1="13" y1="4" x2="19" y2="4" stroke="currentColor" strokeWidth="1"/>
              <circle cx="20" cy="4" r="1.5" stroke="currentColor" strokeWidth="1"/>
              <line x1="22" y1="4" x2="32" y2="4" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <p className="text-center text-[10px]" style={{ color: '#fafafa', opacity: 0.5 }}>
            v1.0 · Desenvolvido por Kauã-R12
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
