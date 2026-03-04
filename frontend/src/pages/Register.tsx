import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden" style={{ background: '#0a0a0f' }}>

      {/* Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute" style={{ top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,119,255,0.12), transparent 65%)' }} />
        <div className="absolute" style={{ bottom: '-15%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,154,0,0.10), transparent 65%)' }} />
      </div>

      {/* Grid sutil */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(#9333ea 1px,transparent 1px),linear-gradient(90deg,#9333ea 1px,transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#12121a', border: '1px solid #1e1e2e' }}>
          <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,#FF9A00,#EA77FF,#9333ea,#31A8FF)' }} />

          <div className="p-8">
            <div className="flex flex-col items-center mb-7">
              <img src="/logo.png" alt="ADTAG" className="h-14 w-auto object-contain mb-4"
                style={{ filter: 'brightness(0) invert(1)' }} />
              <h1 className="text-xl font-bold tracking-tight" style={{ color: '#fafafa' }}>Criar conta gratuita</h1>
              <p className="text-xs mt-1 text-center" style={{ color: '#fafafa' }}>
                Comece sua jornada no design e criação
              </p>
            </div>

            <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg,transparent,#1e1e2e 30%,#1e1e2e 70%,transparent)' }} />

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-xl text-xs font-medium" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#fafafa' }}>Nome completo</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)} required minLength={3}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: '#1a1a25', border: '1px solid #1e1e2e', color: '#fafafa' }}
                  onFocus={e => (e.target.style.borderColor = '#FF9A0055')}
                  onBlur={e => (e.target.style.borderColor = '#1e1e2e')}
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#fafafa' }}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: '#1a1a25', border: '1px solid #1e1e2e', color: '#fafafa' }}
                  onFocus={e => (e.target.style.borderColor = '#FF9A0055')}
                  onBlur={e => (e.target.style.borderColor = '#1e1e2e')}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#fafafa' }}>Senha</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: '#1a1a25', border: '1px solid #1e1e2e', color: '#fafafa' }}
                  onFocus={e => (e.target.style.borderColor = '#FF9A0055')}
                  onBlur={e => (e.target.style.borderColor = '#1e1e2e')}
                  placeholder="Mín. 6 caracteres"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all disabled:opacity-40 mt-2"
                style={{ background: 'linear-gradient(135deg,#FF9A00,#ea580c)', color: '#fff', boxShadow: '0 0 30px rgba(255,154,0,0.2)' }}
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </form>

            <p className="text-xs text-center mt-5" style={{ color: '#fafafa' }}>
              Já tem conta?{' '}
              <Link to="/login" className="font-bold" style={{ color: '#FF9A00' }}>
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
