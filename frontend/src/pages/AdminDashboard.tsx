import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  totalUsers: number;
  totalModules: number;
  totalVideos: number;
  totalCompletions: number;
  avgProgress: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  completedVideos: number;
  totalVideos: number;
  progressPercent: number;
}

interface AdminModule {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface AdminVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  order: number;
  moduleId: string;
}

type Tab = 'stats' | 'users' | 'modules' | 'videos';

// ─── Gráfico de Gauge (semicircular) ─────────────────────────────────────────

const GaugeChart: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => {
  const r = 54;
  const circumference = Math.PI * r; // semicírculo
  const offset = circumference * (1 - value / 100);
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 140, height: 80 }}>
        <svg viewBox="0 0 140 80" width="140" height="80">
          {/* Trilha */}
          <path d="M 16 74 A 54 54 0 0 1 124 74" fill="none" stroke="#1a1a28" strokeWidth="10" strokeLinecap="round" />
          {/* Progresso */}
          <path
            d="M 16 74 A 54 54 0 0 1 124 74"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
          {/* Valor central */}
          <text x="70" y="68" textAnchor="middle" fontSize="18" fontWeight="900" fill="#fafafa" fontFamily="system-ui">{value}%</text>
        </svg>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#fafafa' }}>{label}</p>
    </div>
  );
};

// ─── Barra horizontal ─────────────────────────────────────────────────────────

const BarRow: React.FC<{ label: string; value: number; max: number; color: string; abbr?: string }> = ({ label, value, max, color, abbr }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      {abbr && (
        <span className="flex-shrink-0 text-[10px] font-black w-6 text-right" style={{ color, fontFamily: 'monospace' }}>{abbr}</span>
      )}
      <div className="flex-shrink-0 w-28 text-xs truncate" style={{ color: '#fafafa' }}>{label}</div>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1a1a28' }}>
        <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}55` }} />
      </div>
      <span className="flex-shrink-0 text-xs font-black w-8 text-right" style={{ color }}>{value}</span>
    </div>
  );
};

// ─── Donut simples ────────────────────────────────────────────────────────────

const DonutChart: React.FC<{ value: number; total: number; color: string; label: string }> = ({ value, total, color, label }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#1a1a28" strokeWidth="7" />
          <circle cx="44" cy="44" r={r} fill="none"
            stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={offset}
            transform="rotate(-90 44 44)"
            style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 5px ${color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-black leading-none" style={{ color: '#fafafa' }}>{pct}%</span>
        </div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#fafafa' }}>{label}</p>
      <p className="text-xs font-black" style={{ color }}>{value}<span className="font-normal text-[10px]" style={{ color: '#fafafa' }}>/{total}</span></p>
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
    <div className="w-full max-w-lg rounded-2xl border overflow-hidden shadow-2xl" style={{ background: '#12121a', borderColor: '#1e1e2e' }}>
      <div className="h-[2px]" style={{ background: 'linear-gradient(90deg,#31A8FF,#9333ea,#FF9A00)' }} />
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#1e1e2e' }}>
        <h3 className="text-sm font-bold" style={{ color: '#fafafa' }}>{title}</h3>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full text-xl leading-none transition-colors"
          style={{ color: '#fafafa' }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#fafafa')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#fafafa')}
        >×</button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#fafafa' }}>{label}</label>
    {children}
  </div>
);

const iStyle = { background: '#1a1a25', border: '1px solid #1e1e2e', color: '#fafafa' };
const iCls = "w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all";

// ─── Main ─────────────────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [moduleModal, setModuleModal] = useState<{ open: boolean; data: Partial<AdminModule> }>({ open: false, data: {} });
  const [videoModal, setVideoModal] = useState<{ open: boolean; data: Partial<AdminVideo> }>({ open: false, data: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats   = async () => { const { data } = await api.get<Stats>('/admin/stats'); setStats(data); };
  const fetchUsers   = async () => { const { data } = await api.get<AdminUser[]>('/admin/users'); setUsers(data); };
  const fetchModules = async () => { const { data } = await api.get<{ id: string; title: string; description: string; order: number }[]>('/modules'); setModules(data); };
  const fetchVideos  = async () => {
    const { data } = await api.get<{ id: string; videos: AdminVideo[] }[]>('/modules');
    setVideos(data.flatMap(m => (m.videos ?? []).map(v => ({ ...v, moduleId: m.id }))));
  };

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => {
    if (activeTab === 'users')   fetchUsers();
    if (activeTab === 'modules') fetchModules();
    if (activeTab === 'videos')  { fetchModules(); fetchVideos(); }
  }, [activeTab]);

  const saveModule = async () => {
    setLoading(true); setError('');
    try {
      const payload = { title: moduleModal.data.title, description: moduleModal.data.description, order: Number(moduleModal.data.order) };
      moduleModal.data.id ? await api.put(`/admin/modules/${moduleModal.data.id}`, payload) : await api.post('/admin/modules', payload);
      setModuleModal({ open: false, data: {} }); fetchModules();
    } catch (e: any) { setError(e.response?.data?.error ?? 'Erro ao salvar'); }
    finally { setLoading(false); }
  };

  const deleteModule = async (id: string) => {
    if (!confirm('Excluir módulo? Todos os vídeos serão excluídos também.')) return;
    await api.delete(`/admin/modules/${id}`); fetchModules();
  };

  const saveVideo = async () => {
    setLoading(true); setError('');
    try {
      const payload = { title: videoModal.data.title, description: videoModal.data.description, url: videoModal.data.url, duration: Number(videoModal.data.duration), order: Number(videoModal.data.order), moduleId: videoModal.data.moduleId };
      videoModal.data.id ? await api.put(`/admin/videos/${videoModal.data.id}`, payload) : await api.post('/admin/videos', payload);
      setVideoModal({ open: false, data: {} }); fetchVideos();
    } catch (e: any) { setError(e.response?.data?.error ?? 'Erro ao salvar'); }
    finally { setLoading(false); }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('Excluir vídeo?')) return;
    await api.delete(`/admin/videos/${id}`); fetchVideos();
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'stats',   label: 'Visão Geral' },
    { key: 'users',   label: 'Usuários'    },
    { key: 'modules', label: 'Módulos'     },
    { key: 'videos',  label: 'Vídeos'      },
  ];

  const completionRate = stats && stats.totalVideos > 0 && stats.totalUsers > 0
    ? Math.round((stats.totalCompletions / (stats.totalVideos * stats.totalUsers)) * 100)
    : 0;

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <div className="pointer-events-none fixed inset-0 z-0" style={{ backgroundImage: 'url(/marca-dagua.png)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '40%', opacity: 0.015, filter: 'invert(1)' }} />

      <Header />

      {/* Banner */}
      <div className="relative z-10" style={{ background: '#0f0f14', borderBottom: '1px solid #1e1e2e' }}>
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f59e0b,#ea580c)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight" style={{ color: '#fafafa' }}>Painel Administrativo</h1>
              <p className="text-[11px]" style={{ color: '#fafafa' }}>Gerencie trilhas, aulas e alunos da plataforma criativa</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-7">

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl p-1 mb-7 w-fit border" style={{ background: '#0f0f14', borderColor: '#1e1e2e' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              style={activeTab === t.key
                ? { background: 'linear-gradient(135deg,#0f4c81,#1a6fb5)', color: '#fff', border: '1px solid rgba(49,168,255,0.3)' }
                : { color: '#fafafa', background: 'transparent' }}
            >{t.label}</button>
          ))}
        </div>

        {/* ── VISÃO GERAL ─────────────────────────────────────────────────────── */}
        {activeTab === 'stats' && (
          <div>
            {!stats ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-6 h-6 border-[3px] border-t-transparent rounded-full animate-spin" style={{ borderColor: '#9333ea', borderTopColor: 'transparent' }} />
              </div>
            ) : (
              <div className="space-y-5">

                {/* Cards de totais */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Alunos',    value: stats.totalUsers,       color: '#31A8FF', abbr: null },
                    { label: 'Módulos',   value: stats.totalModules,     color: '#FF9A00', abbr: null },
                    { label: 'Aulas',     value: stats.totalVideos,      color: '#9999FF', abbr: null },
                    { label: 'Conclusões',value: stats.totalCompletions, color: '#10b981', abbr: null },
                  ].map(c => (
                    <div key={c.label} className="rounded-xl border p-4 flex items-center gap-3" style={{ background: '#12121a', borderColor: '#1e1e2e' }}>
                      <div className="w-1 self-stretch rounded-full" style={{ background: c.color }} />
                      <div>
                        <p className="text-2xl font-black leading-none" style={{ color: '#fafafa' }}>{c.value}</p>
                        <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: '#fafafa' }}>{c.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gráficos */}
                <div className="grid md:grid-cols-3 gap-4">

                  {/* Gauge — Progresso médio */}
                  <div className="rounded-xl border p-5 flex flex-col items-center justify-center" style={{ background: '#12121a', borderColor: '#1e1e2e' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#fafafa' }}>Progresso Médio</p>
                    <GaugeChart value={stats.avgProgress} label="dos alunos" color="#9333ea" />
                  </div>

                  {/* Donut — Taxa de conclusão */}
                  <div className="rounded-xl border p-5 flex flex-col items-center justify-center" style={{ background: '#12121a', borderColor: '#1e1e2e' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#fafafa' }}>Taxa de Conclusão</p>
                    <DonutChart
                      value={stats.totalCompletions}
                      total={stats.totalVideos * Math.max(stats.totalUsers, 1)}
                      color="#31A8FF"
                      label="aulas concluídas"
                    />
                  </div>

                  {/* Barras — visão geral */}
                  <div className="rounded-xl border p-5" style={{ background: '#12121a', borderColor: '#1e1e2e' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: '#fafafa' }}>Distribuição</p>
                    <div className="space-y-4">
                      <BarRow label="Alunos"     value={stats.totalUsers}        max={Math.max(stats.totalUsers, 1)}       color="#31A8FF" abbr="usr" />
                      <BarRow label="Módulos"    value={stats.totalModules}      max={Math.max(stats.totalModules, 1)}     color="#FF9A00" abbr="mod" />
                      <BarRow label="Aulas"      value={stats.totalVideos}       max={Math.max(stats.totalVideos, 1)}      color="#9999FF" abbr="vid" />
                      <BarRow label="Conclusões" value={stats.totalCompletions}  max={Math.max(stats.totalVideos * Math.max(stats.totalUsers,1), 1)} color="#10b981" abbr="ok" />
                    </div>

                    {/* Linha de completion rate */}
                    <div className="mt-5 pt-4 border-t" style={{ borderColor: '#1e1e2e' }}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: '#fafafa' }}>Conclusão total</span>
                        <span className="text-xs font-black" style={{ color: completionRate > 60 ? '#10b981' : completionRate > 30 ? '#FF9A00' : '#9333ea' }}>{completionRate}%</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: '#1a1a28' }}>
                        <div className="h-2 rounded-full transition-all duration-700"
                          style={{ width: `${completionRate}%`, background: `linear-gradient(90deg, #9333ea, #31A8FF)`, boxShadow: '0 0 8px rgba(49,168,255,0.4)' }} />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Linha decorativa com ferramentas */}
                <div className="rounded-xl border p-4 flex items-center justify-between" style={{ background: '#0f0f14', borderColor: '#1e1e2e' }}>
                  <p className="text-xs" style={{ color: '#fafafa' }}>Plataforma de Design Criativo · Juventude ADTAG</p>
                  <div className="flex items-center gap-1.5">
                    {[{a:'Ps',c:'#31A8FF'},{a:'Pr',c:'#EA77FF'},{a:'Ai',c:'#FF9A00'},{a:'Ae',c:'#9999FF'}].map(t=>(
                      <span key={t.a} className="text-[9px] font-black px-1.5 py-0.5 rounded"
                        style={{ fontFamily:'monospace', color:t.c, background:t.c+'12', border:`1px solid ${t.c}22` }}>{t.a}</span>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ── USUÁRIOS ────────────────────────────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: '#1e1e2e' }}>
            <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: '#1e1e2e' }}>
              <h2 className="text-sm font-bold" style={{ color: '#fafafa' }}>Alunos cadastrados</h2>
              <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ color: '#fafafa', background: '#1a1a25', border: '1px solid #1e1e2e' }}>{users.length} alunos</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider border-b" style={{ color: '#fafafa', borderColor: '#1e1e2e' }}>
                  <th className="px-6 py-3 text-left">Aluno</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-center">Perfil</th>
                  <th className="px-6 py-3 text-left">Progresso</th>
                  <th className="px-6 py-3 text-center">Aulas</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-xs" style={{ color: '#fafafa' }}>Nenhum aluno encontrado</td></tr>
                )}
                {users.map(u => (
                  <tr key={u.id} className="border-t transition-colors" style={{ borderColor: '#151520' }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#9333ea,#6d28d9)' }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm" style={{ color: '#fafafa' }}>{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs" style={{ color: '#fafafa' }}>{u.email}</td>
                    <td className="px-6 py-4 text-center">
                      {u.isAdmin
                        ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>Admin</span>
                        : <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#1a1a25', color: '#fafafa', border: '1px solid #1e1e2e' }}>Aluno</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full max-w-[100px]" style={{ background: '#1a1a25' }}>
                          <div className="h-1 rounded-full" style={{ width: `${u.progressPercent}%`, background: 'linear-gradient(90deg,#9333ea,#31A8FF)' }} />
                        </div>
                        <span className="text-xs font-black w-8 text-right" style={{ color: '#9333ea' }}>{u.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-mono" style={{ color: '#fafafa' }}>{u.completedVideos}/{u.totalVideos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── MÓDULOS ─────────────────────────────────────────────────────────── */}
        {activeTab === 'modules' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setModuleModal({ open: true, data: {} })}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
                style={{ background: 'linear-gradient(135deg,#9333ea,#6d28d9)', color: '#fff' }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Nova Trilha
              </button>
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: '#1e1e2e' }}>
              <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: '#1e1e2e' }}>
                <h2 className="text-sm font-bold" style={{ color: '#fafafa' }}>Trilhas criativas</h2>
                <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ color: '#fafafa', background: '#1a1a25', border: '1px solid #1e1e2e' }}>{modules.length} trilhas</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider border-b" style={{ color: '#fafafa', borderColor: '#1e1e2e' }}>
                    <th className="px-6 py-3 text-center w-14">#</th>
                    <th className="px-6 py-3 text-left">Título</th>
                    <th className="px-6 py-3 text-left">Descrição</th>
                    <th className="px-6 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.length === 0 && <tr><td colSpan={4} className="px-6 py-10 text-center text-xs" style={{ color: '#fafafa' }}>Nenhuma trilha cadastrada</td></tr>}
                  {modules.map(m => (
                    <tr key={m.id} className="border-t" style={{ borderColor: '#151520' }}>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex w-7 h-7 items-center justify-center rounded-lg text-xs font-black" style={{ background: '#1a1a25', color: '#fafafa' }}>{m.order}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold" style={{ color: '#fafafa' }}>{m.title}</td>
                      <td className="px-6 py-4 max-w-xs truncate text-xs" style={{ color: '#fafafa' }}>{m.description}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setModuleModal({ open: true, data: m })} className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors" style={{ color: '#9333ea' }}>Editar</button>
                          <button onClick={() => deleteModule(m.id)} className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors" style={{ color: '#ef4444' }}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── VÍDEOS ──────────────────────────────────────────────────────────── */}
        {activeTab === 'videos' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setVideoModal({ open: true, data: {} })}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
                style={{ background: 'linear-gradient(135deg,#9333ea,#6d28d9)', color: '#fff' }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Nova Aula
              </button>
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: '#1e1e2e' }}>
              <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: '#1e1e2e' }}>
                <h2 className="text-sm font-bold" style={{ color: '#fafafa' }}>Aulas cadastradas</h2>
                <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ color: '#fafafa', background: '#1a1a25', border: '1px solid #1e1e2e' }}>{videos.length} aulas</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider border-b" style={{ color: '#fafafa', borderColor: '#1e1e2e' }}>
                    <th className="px-6 py-3 text-left">Título</th>
                    <th className="px-6 py-3 text-left">Trilha</th>
                    <th className="px-6 py-3 text-center">Ordem</th>
                    <th className="px-6 py-3 text-center">Duração</th>
                    <th className="px-6 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-xs" style={{ color: '#fafafa' }}>Nenhuma aula cadastrada</td></tr>}
                  {videos.map(v => (
                    <tr key={v.id} className="border-t" style={{ borderColor: '#151520' }}>
                      <td className="px-6 py-4 font-semibold" style={{ color: '#fafafa' }}>{v.title}</td>
                      <td className="px-6 py-4 text-xs" style={{ color: '#fafafa' }}>{modules.find(m => m.id === v.moduleId)?.title ?? '—'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex w-7 h-7 items-center justify-center rounded-lg text-xs font-black" style={{ background: '#1a1a25', color: '#fafafa' }}>{v.order}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-xs font-mono" style={{ color: '#fafafa' }}>{Math.floor(v.duration / 60)}min</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setVideoModal({ open: true, data: v })} className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ color: '#9333ea' }}>Editar</button>
                          <button onClick={() => deleteVideo(v.id)} className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ color: '#ef4444' }}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Módulo */}
      {moduleModal.open && (
        <Modal title={moduleModal.data.id ? 'Editar Trilha' : 'Nova Trilha'} onClose={() => setModuleModal({ open: false, data: {} })}>
          <div className="space-y-4">
            {error && <p className="text-xs px-3 py-2 rounded-xl" style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</p>}
            <Field label="Título da Trilha">
              <input type="text" value={moduleModal.data.title ?? ''} onChange={e => setModuleModal(m => ({ ...m, data: { ...m.data, title: e.target.value } }))} className={iCls} style={iStyle} placeholder="Ex: Photoshop do Zero ao Avançado" />
            </Field>
            <Field label="Descrição">
              <textarea value={moduleModal.data.description ?? ''} onChange={e => setModuleModal(m => ({ ...m, data: { ...m.data, description: e.target.value } }))} className={iCls + ' resize-none'} style={iStyle} rows={3} placeholder="Descreva o conteúdo desta trilha" />
            </Field>
            <Field label="Ordem">
              <input type="number" min={1} value={moduleModal.data.order ?? ''} onChange={e => setModuleModal(m => ({ ...m, data: { ...m.data, order: Number(e.target.value) } }))} className={iCls} style={iStyle} placeholder="1" />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModuleModal({ open: false, data: {} })} className="px-4 py-2 text-xs font-bold rounded-xl uppercase tracking-wider" style={{ color: '#fafafa', border: '1px solid #1e1e2e', background: 'transparent' }}>Cancelar</button>
              <button onClick={saveModule} disabled={loading} className="px-4 py-2 text-xs font-bold rounded-xl uppercase tracking-wider disabled:opacity-40" style={{ background: 'linear-gradient(135deg,#9333ea,#6d28d9)', color: '#fff' }}>{loading ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Vídeo */}
      {videoModal.open && (
        <Modal title={videoModal.data.id ? 'Editar Aula' : 'Nova Aula'} onClose={() => setVideoModal({ open: false, data: {} })}>
          <div className="space-y-4">
            {error && <p className="text-xs px-3 py-2 rounded-xl" style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</p>}
            <Field label="Trilha">
              <select value={videoModal.data.moduleId ?? ''} onChange={e => setVideoModal(v => ({ ...v, data: { ...v.data, moduleId: e.target.value } }))} className={iCls} style={iStyle}>
                <option value="">Selecione uma trilha</option>
                {modules.map(m => <option key={m.id} value={m.id}>{m.order}. {m.title}</option>)}
              </select>
            </Field>
            <Field label="Título da Aula">
              <input type="text" value={videoModal.data.title ?? ''} onChange={e => setVideoModal(v => ({ ...v, data: { ...v.data, title: e.target.value } }))} className={iCls} style={iStyle} placeholder="Ex: Criando um flyer profissional" />
            </Field>
            <Field label="Descrição">
              <textarea value={videoModal.data.description ?? ''} onChange={e => setVideoModal(v => ({ ...v, data: { ...v.data, description: e.target.value } }))} className={iCls + ' resize-none'} style={iStyle} rows={2} />
            </Field>
            <Field label="URL do Vídeo">
              <input type="url" value={videoModal.data.url ?? ''} onChange={e => setVideoModal(v => ({ ...v, data: { ...v.data, url: e.target.value } }))} className={iCls} style={iStyle} placeholder="https://..." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Duração (segundos)">
                <input type="number" min={1} value={videoModal.data.duration ?? ''} onChange={e => setVideoModal(v => ({ ...v, data: { ...v.data, duration: Number(e.target.value) } }))} className={iCls} style={iStyle} placeholder="600" />
              </Field>
              <Field label="Ordem">
                <input type="number" min={1} value={videoModal.data.order ?? ''} onChange={e => setVideoModal(v => ({ ...v, data: { ...v.data, order: Number(e.target.value) } }))} className={iCls} style={iStyle} placeholder="1" />
              </Field>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setVideoModal({ open: false, data: {} })} className="px-4 py-2 text-xs font-bold rounded-xl uppercase tracking-wider" style={{ color: '#fafafa', border: '1px solid #1e1e2e', background: 'transparent' }}>Cancelar</button>
              <button onClick={saveVideo} disabled={loading} className="px-4 py-2 text-xs font-bold rounded-xl uppercase tracking-wider disabled:opacity-40" style={{ background: 'linear-gradient(135deg,#9333ea,#6d28d9)', color: '#fff' }}>{loading ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
