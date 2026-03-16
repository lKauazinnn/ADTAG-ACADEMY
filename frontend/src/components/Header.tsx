import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const inSubRoute = location.pathname.startsWith('/module') || location.pathname.startsWith('/video');
  const storedCategory = sessionStorage.getItem('currentCategory') || 'editor';
  const isEditorRoute = location.pathname === '/dashboard' || (inSubRoute && storedCategory === 'editor');
  const isSocialRoute = location.pathname === '/social-media' || (inSubRoute && storedCategory === 'social');
  const isMusicosRoute = location.pathname === '/musicos' || (inSubRoute && storedCategory === 'musicos');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="relative text-white" style={{ background: '#0f0f14', borderBottom: '1px solid #1e1e2e' }}>
      {/* Barra de acento no topo */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #31A8FF, #9333ea, #EA77FF, #FF9A00)' }} />

      <div className="max-w-7xl mx-auto px-5 py-2.5">
        <div className="flex items-center justify-between">

          {/* Logo + ferramentas */}
          <div className="flex items-center gap-4">
            <img
              src="/marca-dagua.png"
              alt="ADTAG"
              className="h-16 w-auto cursor-pointer object-contain transition-opacity hover:opacity-80"
              style={{ filter: 'brightness(0) invert(1)' }}
              onClick={() => navigate('/dashboard')}
            />

          </div>

          {/* Nav central */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs font-semibold px-3.5 py-2 rounded-lg uppercase tracking-wider"
              style={{
                background: isEditorRoute ? 'rgba(49,168,255,0.08)' : 'transparent',
                color: isEditorRoute ? '#31A8FF' : '#6b6b8a',
                border: isEditorRoute ? '1px solid rgba(49,168,255,0.2)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (isEditorRoute) return; (e.currentTarget as HTMLButtonElement).style.color = '#c8c8e8'; (e.currentTarget as HTMLButtonElement).style.background = '#1a1a24'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#1e1e2e'; }}
              onMouseLeave={e => { if (isEditorRoute) return; (e.currentTarget as HTMLButtonElement).style.color = '#6b6b8a'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}
            >
              Editor
            </button>
            <button
              onClick={() => navigate('/social-media')}
              className="text-xs font-semibold px-3.5 py-2 rounded-lg uppercase tracking-wider"
              style={{
                background: isSocialRoute ? 'rgba(225,48,108,0.08)' : 'transparent',
                color: isSocialRoute ? '#E1306C' : '#6b6b8a',
                border: isSocialRoute ? '1px solid rgba(225,48,108,0.2)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (isSocialRoute) return; (e.currentTarget as HTMLButtonElement).style.color = '#E1306C'; (e.currentTarget as HTMLButtonElement).style.background = '#E1306C18'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#E1306C33'; }}
              onMouseLeave={e => { if (isSocialRoute) return; (e.currentTarget as HTMLButtonElement).style.color = '#6b6b8a'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}
            >
              Social Media
            </button>
            <button
              onClick={() => navigate('/musicos')}
              className="text-xs font-semibold px-3.5 py-2 rounded-lg uppercase tracking-wider"
              style={{
                background: isMusicosRoute ? 'rgba(255,154,0,0.08)' : 'transparent',
                color: isMusicosRoute ? '#FF9A00' : '#6b6b8a',
                border: isMusicosRoute ? '1px solid rgba(255,154,0,0.2)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (isMusicosRoute) return; (e.currentTarget as HTMLButtonElement).style.color = '#FF9A00'; (e.currentTarget as HTMLButtonElement).style.background = '#FF9A0018'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#FF9A0033'; }}
              onMouseLeave={e => { if (isMusicosRoute) return; (e.currentTarget as HTMLButtonElement).style.color = '#6b6b8a'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}
            >
              Músicos
            </button>
          </nav>

          {/* Direita */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm" style={{ color: '#6b6b8a' }}>
              <span style={{ color: '#c8c8e8', fontWeight: 600 }}>{user.name}</span>
            </span>

            {user.isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-all"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#ea580c)', color: '#fff', letterSpacing: '0.03em' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                ADMIN
              </button>
            )}

            <button
              onClick={handleLogout}
              className="text-xs font-semibold px-3.5 py-2 rounded-lg transition-all uppercase tracking-wider"
              style={{ background: '#1a1a24', color: '#6b6b8a', border: '1px solid #1e1e2e' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#c8c8e8'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#9333ea55'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6b6b8a'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#1e1e2e'; }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
