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
        <div className="absolute" style={{ top: '-15%', left: '-8%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(49,168,255,0.22), transparent 65%)' }} />
        <div className="absolute" style={{ bottom: '-20%', right: '-8%', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.22), transparent 65%)' }} />
        <div className="absolute" style={{ top: '40%', left: '40%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,154,0,0.10), transparent 65%)' }} />
        <div className="absolute" style={{ top: '20%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,119,255,0.12), transparent 65%)' }} />
        <div className="absolute" style={{ bottom: '20%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(49,197,244,0.10), transparent 65%)' }} />
      </div>

      {/* Grid sutil */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{ backgroundImage: 'linear-gradient(#9333ea 1px,transparent 1px),linear-gradient(90deg,#9333ea 1px,transparent 1px)', backgroundSize: '50px 50px' }} />

      {/* Badges flutuantes das ferramentas */}
      {toolBadges.map(t => (
        <div key={t.abbr} className="pointer-events-none absolute select-none"
          style={{ top: t.top, left: t.left, opacity: 0.28 }}>
          <div style={{ width: 60, height: 60, borderRadius: 12, background: t.color + '33', border: `1px solid ${t.color}77`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, boxShadow: `0 0 18px ${t.color}44` }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: t.color, fontFamily: 'monospace', letterSpacing: '-0.02em' }}>{t.abbr}</span>
          </div>
          <p style={{ fontSize: 8, color: t.color, textAlign: 'center', marginTop: 4, fontWeight: 600, letterSpacing: '0.04em' }}>{t.name.toUpperCase()}</p>
        </div>
      ))}

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Card */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#12121a', border: '1px solid #1e1e2e' }}>

          {/* Topo colorido */}
          <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,#31A8FF,#9333ea,#EA77FF,#FF9A00)' }} />

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
                  style={{ background: '#1a1a25', border: '1px solid #1e1e2e', color: '#fafafa' }}
                  onFocus={e => (e.target.style.borderColor = '#31A8FF55')}
                  onBlur={e => (e.target.style.borderColor = '#1e1e2e')}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#fafafa' }}>Senha</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: '#1a1a25', border: '1px solid #1e1e2e', color: '#fafafa' }}
                  onFocus={e => (e.target.style.borderColor = '#31A8FF55')}
                  onBlur={e => (e.target.style.borderColor = '#1e1e2e')}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all disabled:opacity-40 mt-2"
                style={{ background: 'linear-gradient(135deg,#0f4c81,#1a6fb5)', color: '#fff', boxShadow: '0 0 24px hsla(205, 100%, 60%, 0.20)', border: '1px solid #31a8ff4d' }}
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
