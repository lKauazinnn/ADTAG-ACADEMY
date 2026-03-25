import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const isResetMode = useMemo(() => !!token, [token]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(response.data?.message || 'Se o e-mail existir, enviaremos as instruções de redefinição.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Não foi possível enviar o e-mail de redefinição.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      setSuccess(response.data?.message || 'Senha redefinida com sucesso.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Não foi possível redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0a0f' }}>
      <div className="w-full max-w-md rounded-2xl p-7" style={{ background: '#0b0b14', border: '1px solid #1f2238', boxShadow: '0 20px 80px rgba(0,0,0,0.55)' }}>
        <h1 className="text-xl font-black mb-2" style={{ color: '#fafafa' }}>
          {isResetMode ? 'Criar nova senha' : 'Esqueci minha senha'}
        </h1>
        <p className="text-sm mb-6" style={{ color: '#9494b8' }}>
          {isResetMode
            ? 'Digite sua nova senha para concluir a redefinição.'
            : 'Informe seu e-mail para receber o link de redefinição.'}
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-xs font-medium" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 px-4 py-3 rounded-xl text-xs font-medium" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
            {success}
          </div>
        )}

        {!isResetMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#fafafa' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: '#13131e', border: '1px solid #252540', color: '#fafafa' }}
                placeholder="seu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm tracking-wide disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#0f4c81,#1a6fb5)', color: '#fff', border: '1px solid #31a8ff4d' }}
            >
              {loading ? 'Enviando...' : 'Enviar e-mail de redefinição'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#fafafa' }}>Nova senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: '#13131e', border: '1px solid #252540', color: '#fafafa' }}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#fafafa' }}>Confirmar senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: '#13131e', border: '1px solid #252540', color: '#fafafa' }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm tracking-wide disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#0f4c81,#1a6fb5)', color: '#fff', border: '1px solid #31a8ff4d' }}
            >
              {loading ? 'Redefinindo...' : 'Redefinir senha'}
            </button>
          </form>
        )}

        <p className="text-xs text-center mt-5" style={{ color: '#9494b8' }}>
          <Link to="/login" className="font-bold" style={{ color: '#71c4ffce' }}>
            Voltar para login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
