import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const now = () =>
  new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

/* ─── SVG Icons ─── */
const SendIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CloseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/* ─── Keyframes ─── */
const STYLES = `
  /* Typing dots */
  @keyframes lumiBounce {
    0%,80%,100% { transform: translateY(0) scale(1);   opacity:.4; }
    40%         { transform: translateY(-8px) scale(1.2); opacity:1; }
  }

  /* Panel entrance — spring */
  @keyframes lumiSpring {
    0%   { opacity:0; transform: translateY(24px) scale(0.92); }
    60%  { opacity:1; transform: translateY(-4px) scale(1.01); }
    80%  { transform: translateY(2px) scale(0.995); }
    100% { transform: translateY(0) scale(1); }
  }

  /* Message slide-in from left */
  @keyframes lumiMsgLeft {
    from { opacity:0; transform: translateX(-14px) scale(0.96); }
    to   { opacity:1; transform: translateX(0)     scale(1); }
  }
  /* Message slide-in from right */
  @keyframes lumiMsgRight {
    from { opacity:0; transform: translateX(14px) scale(0.96); }
    to   { opacity:1; transform: translateX(0)    scale(1); }
  }

  /* FAB pulse ring */
  @keyframes lumiPulse {
    0%   { transform: scale(1);   opacity:.6; }
    70%  { transform: scale(1.9); opacity:0; }
    100% { transform: scale(1.9); opacity:0; }
  }

  /* FAB icon spin on toggle */
  @keyframes lumiSpin {
    from { transform: rotate(-90deg) scale(0.7); opacity:0; }
    to   { transform: rotate(0deg)   scale(1);   opacity:1; }
  }

  /* Shimmer sweep on send button */
  @keyframes lumiShimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  /* Avatar halo rotate */
  @keyframes lumiHalo {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* Online dot ripple */
  @keyframes lumiRipple {
    0%   { box-shadow: 0 0 0 0   rgba(74,222,128,.6); }
    100% { box-shadow: 0 0 0 7px rgba(74,222,128,0); }
  }

  /* Gradient header shift */
  @keyframes lumiGrad {
    0%,100% { background-position: 0% 50%; }
    50%     { background-position: 100% 50%; }
  }

  /* Typing bubble pop-in */
  @keyframes lumiPop {
    0%   { opacity:0; transform: scale(.7); }
    70%  { transform: scale(1.05); }
    100% { opacity:1; transform: scale(1); }
  }

  /* classes */
  .lumi-msg-left  { animation: lumiMsgLeft  .28s cubic-bezier(.22,1,.36,1) both; }
  .lumi-msg-right { animation: lumiMsgRight .28s cubic-bezier(.22,1,.36,1) both; }
  .lumi-pop       { animation: lumiPop .25s cubic-bezier(.34,1.56,.64,1) both; }

  .lumi-input { transition: border-color .2s, box-shadow .2s; outline:none; }
  .lumi-input:focus {
    border-color: rgba(139,92,246,.75) !important;
    box-shadow: 0 0 0 4px rgba(139,92,246,.14) !important;
  }
  .lumi-input::placeholder { color: rgba(156,163,175,.4); }

  .lumi-scroll::-webkit-scrollbar { width:3px; }
  .lumi-scroll::-webkit-scrollbar-track { background:transparent; }
  .lumi-scroll::-webkit-scrollbar-thumb { background:rgba(139,92,246,.3); border-radius:99px; }

  .lumi-send-btn {
    position: relative; overflow: hidden;
    transition: transform .15s, box-shadow .15s;
  }
  .lumi-send-btn:not(:disabled):hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(109,40,217,.6) !important;
  }
  .lumi-send-btn:not(:disabled):hover::after {
    content:'';
    position:absolute; inset:0; border-radius:12px;
    background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.25) 50%, transparent 70%);
    background-size: 200% 100%;
    animation: lumiShimmer .6s linear;
  }
  .lumi-send-btn:not(:disabled):active { transform: scale(.95); }

  .lumi-close-btn { transition: background .15s, transform .15s; }
  .lumi-close-btn:hover { background: rgba(255,255,255,.22) !important; transform: scale(1.1); }

  .lumi-fab-btn {
    transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
  }
  .lumi-fab-btn:hover {
    transform: scale(1.12) !important;
    box-shadow: 0 10px 36px rgba(109,40,217,.7) !important;
  }
  .lumi-fab-btn:active { transform: scale(.94) !important; }

  .lumi-icon-anim { animation: lumiSpin .3s cubic-bezier(.34,1.56,.64,1) both; }
`;

/* ─── Typing indicator ─── */
const TypingDots = () => (
  <span style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'2px 2px' }}>
    {[0,1,2].map(i => (
      <span key={i} style={{
        width:'7px', height:'7px', borderRadius:'50%',
        background:'rgba(167,139,250,.9)',
        display:'inline-block',
        animation:'lumiBounce 1.1s ease-in-out infinite',
        animationDelay:`${i*.18}s`,
      }}/>
    ))}
  </span>
);

/* ─── Component ─── */
export default function LumiChat() {
  const navigate = useNavigate();
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role:'assistant',
    content:'Olá! Sou a **Lumi** 💜 Como posso ajudar?\n\nPosso verificar seu **progresso**, listar **módulos** ou te levar para o próximo vídeo.',
    time: now(),
  }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [fabKey, setFabKey]   = useState(0); // re-trigger icon anim
  const [navigating, setNavigating] = useState(false);
  const messagesEndRef        = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);

  /* inject styles once */
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
      inputRef.current?.focus();
    }, 80);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, loading]);

  const toggle = () => {
    setOpen(p => !p);
    setFabKey(k => k + 1);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role:'user', content:text, time:now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const history = next.slice(0,-1).map(m => ({ role:m.role, content:m.content }));
      const { data } = await api.post('/chat/message', { message:text, history });

      const assistantMsg: Message = { role:'assistant', content:data.reply, time:now() };
      setMessages([...next, assistantMsg]);

      // Handle autonomous navigation
      if (data.action?.type === 'navigate' && data.action.path) {
        setNavigating(true);
        setTimeout(() => {
          setNavigating(false);
          setOpen(false);
          navigate(data.action.path);
        }, 1800);
      }
    } catch {
      setMessages([...next, {
        role:'assistant',
        content:'Desculpe, ocorreu um erro. Tente novamente.',
        time:now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const renderContent = (text: string) => (
    <span dangerouslySetInnerHTML={{
      __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
    }}/>
  );

  const canSend = !loading && input.trim().length > 0;

  return (
    <>
      {/* ══════════ Panel ══════════ */}
      {open && (
        <div style={{
          position:'fixed', bottom:'88px', right:'24px',
          width:'370px', height:'540px',
          display:'flex', flexDirection:'column',
          background:'rgba(11,10,18,0.97)',
          backdropFilter:'blur(24px)',
          border:'1px solid rgba(139,92,246,.18)',
          borderRadius:'22px',
          boxShadow:'0 32px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.04) inset',
          zIndex:9999, overflow:'hidden',
          animation:'lumiSpring .45s cubic-bezier(.22,1,.36,1) both',
        }}>

          {/* ── Header ── */}
          <div style={{
            display:'flex', alignItems:'center', gap:'12px',
            padding:'15px 18px',
            background:'linear-gradient(270deg,#E1306C,#9333ea,#7c3aed,#E1306C)',
            backgroundSize:'400% 400%',
            animation:'lumiGrad 6s ease infinite',
            borderBottom:'1px solid rgba(255,255,255,.07)',
            flexShrink:0,
          }}>

            {/* Avatar */}
            <div style={{ position:'relative', flexShrink:0 }}>
              {/* Halo ring */}
              <div style={{
                position:'absolute', inset:'-3px', borderRadius:'50%',
                background:'conic-gradient(from 0deg, transparent, #E1306C, #9333ea, transparent)',
                animation:'lumiHalo 2.5s linear infinite',
              }}/>
              {/* Avatar badge */}
              <div style={{
                position:'relative', zIndex:1,
                width:'46px', height:'46px', borderRadius:'50%',
                background:'linear-gradient(135deg, #E1306C 0%, #9333ea 100%)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 4px 16px rgba(225,48,108,.5)',
              }}>
                {/* Sparkle L mark */}
                <svg width="26" height="26" viewBox="0 0 56 56" fill="none">
                  <path d="M17,9 L17,40 L39,40" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17,9 L19.2,15.5 L17,22 L14.8,15.5 Z" fill="white"/>
                  <path d="M10.5,15.5 L17,13.3 L23.5,15.5 L17,17.7 Z" fill="white"/>
                  <circle cx="17" cy="15.5" r="2.4" fill="white"/>
                </svg>
              </div>
              {/* Online dot */}
              <span style={{
                position:'absolute', bottom:'1px', right:'1px',
                width:'11px', height:'11px', borderRadius:'50%',
                background:'#4ade80',
                border:'2px solid #1e0530',
                animation:'lumiRipple 1.8s ease-out infinite',
                zIndex:2,
              }}/>
            </div>

            <div style={{ flex:1 }}>
              <div style={{
                color:'#fff', fontWeight:700, fontSize:'15px',
                letterSpacing:'-.2px', lineHeight:1.2,
              }}>
                Lumi
              </div>
              <div style={{
                color:'rgba(255,255,255,.6)', fontSize:'11px',
                marginTop:'2px', display:'flex', alignItems:'center', gap:'5px',
              }}>
                <span style={{
                  width:'6px', height:'6px', borderRadius:'50%',
                  background:'#4ade80', display:'inline-block',
                  boxShadow:'0 0 6px #4ade80',
                }}/>
                Online agora
              </div>
            </div>

            <button
              className="lumi-close-btn"
              onClick={() => setOpen(false)}
              style={{
                background:'rgba(255,255,255,.1)',
                border:'1px solid rgba(255,255,255,.15)',
                borderRadius:'8px', color:'rgba(255,255,255,.85)',
                cursor:'pointer', width:'30px', height:'30px',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0,
              }}
              aria-label="Fechar"
            >
              <CloseIcon/>
            </button>
          </div>

          {/* ── Messages ── */}
          <div className="lumi-scroll" style={{
            flex:1, overflowY:'auto',
            padding:'18px 16px',
            display:'flex', flexDirection:'column', gap:'14px',
          }}>
            {messages.map((msg, i) => {
              const isUser = msg.role === 'user';
              return (
                <div key={i}
                  className={isUser ? 'lumi-msg-right' : 'lumi-msg-left'}
                  style={{
                    display:'flex', flexDirection:'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    gap:'4px',
                  }}
                >
                  {!isUser && (
                    <span style={{
                      fontSize:'11px', color:'rgba(167,139,250,.75)',
                      fontWeight:700, letterSpacing:'.4px', paddingLeft:'4px',
                      textTransform:'uppercase',
                    }}>
                      Lumi
                    </span>
                  )}

                  <div style={{
                    maxWidth:'83%', padding:'10px 14px',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isUser
                      ? 'linear-gradient(135deg,#7c3aed,#5b21b6)'
                      : 'rgba(255,255,255,.055)',
                    border: isUser ? 'none' : '1px solid rgba(255,255,255,.07)',
                    color: isUser ? '#fff' : '#d1d5db',
                    fontSize:'13.5px', lineHeight:'1.58',
                    whiteSpace:'pre-wrap', wordBreak:'break-word',
                    boxShadow: isUser
                      ? '0 6px 20px rgba(91,33,182,.45), 0 2px 6px rgba(0,0,0,.3)'
                      : '0 2px 8px rgba(0,0,0,.2)',
                  }}>
                    {renderContent(msg.content)}
                  </div>

                  <span style={{
                    fontSize:'10.5px', color:'rgba(156,163,175,.35)',
                    paddingLeft: isUser ? 0 : '4px',
                    paddingRight: isUser ? '4px' : 0,
                  }}>
                    {msg.time}
                  </span>
                </div>
              );
            })}

            {/* Typing indicator */}
            {loading && (
              <div className="lumi-msg-left" style={{
                display:'flex', flexDirection:'column',
                alignItems:'flex-start', gap:'4px',
              }}>
                <span style={{
                  fontSize:'11px', color:'rgba(167,139,250,.75)',
                  fontWeight:700, letterSpacing:'.4px', paddingLeft:'4px',
                  textTransform:'uppercase',
                }}>
                  Lumi
                </span>
                <div className="lumi-pop" style={{
                  padding:'11px 16px',
                  borderRadius:'18px 18px 18px 4px',
                  background:'rgba(255,255,255,.055)',
                  border:'1px solid rgba(255,255,255,.07)',
                  boxShadow:'0 2px 8px rgba(0,0,0,.2)',
                }}>
                  <TypingDots/>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}/>
          </div>

          {/* ── Navigating banner ── */}
          {navigating && (
            <div style={{
              margin:'0 14px 10px',
              padding:'12px 16px',
              borderRadius:'14px',
              background:'linear-gradient(135deg,rgba(109,40,217,.55),rgba(76,29,149,.4))',
              border:'1px solid rgba(167,139,250,.25)',
              boxShadow:'0 4px 24px rgba(91,33,182,.3), inset 0 1px 0 rgba(255,255,255,.06)',
              display:'flex', alignItems:'center', gap:'12px',
              animation:'lumiPop .3s cubic-bezier(.34,1.56,.64,1)',
              flexShrink:0,
              overflow:'hidden',
              position:'relative',
            }}>
              {/* shimmer sweep */}
              <div style={{
                position:'absolute', inset:0,
                background:'linear-gradient(110deg, transparent 25%, rgba(255,255,255,.06) 50%, transparent 75%)',
                backgroundSize:'200% 100%',
                animation:'lumiShimmer 1.4s linear infinite',
              }}/>
              {/* icon with pulse */}
              <div style={{
                position:'relative', flexShrink:0,
                width:'32px', height:'32px', borderRadius:'8px',
                background:'rgba(139,92,246,.25)',
                border:'1px solid rgba(167,139,250,.3)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <span style={{ fontSize:'15px', animation:'lumiHalo 1.2s linear infinite', display:'inline-block' }}>🚀</span>
              </div>
              {/* text */}
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ color:'#e9d5ff', fontSize:'12.5px', fontWeight:700, letterSpacing:'.2px' }}>
                  Navegando...
                </div>
                <div style={{ color:'rgba(196,181,253,.6)', fontSize:'11px', marginTop:'2px' }}>
                  Preparando sua página
                </div>
              </div>
              {/* loading dots right side */}
              <div style={{ marginLeft:'auto', display:'flex', gap:'4px', alignItems:'center', position:'relative', zIndex:1 }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{
                    width:'5px', height:'5px', borderRadius:'50%',
                    background:'rgba(167,139,250,.7)',
                    display:'inline-block',
                    animation:'lumiBounce 1.1s ease-in-out infinite',
                    animationDelay:`${i*.18}s`,
                  }}/>
                ))}
              </div>
            </div>
          )}

          {/* ── Input ── */}
          <div style={{
            padding:'14px 16px',
            borderTop:'1px solid rgba(255,255,255,.05)',
            background:'rgba(255,255,255,.015)',
            display:'flex', gap:'10px', alignItems:'center',
            flexShrink:0,
          }}>
            <input
              ref={inputRef}
              className="lumi-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escreva uma mensagem..."
              disabled={loading}
              style={{
                flex:1,
                background:'rgba(255,255,255,.06)',
                border:'1px solid rgba(255,255,255,.09)',
                borderRadius:'13px',
                padding:'10px 14px',
                color:'#e5e7eb',
                fontSize:'13.5px',
              }}
            />
            <button
              className="lumi-send-btn"
              onClick={sendMessage}
              disabled={!canSend}
              style={{
                background: canSend
                  ? 'linear-gradient(135deg,#7c3aed,#5b21b6)'
                  : 'rgba(139,92,246,.18)',
                border:'none', borderRadius:'13px',
                width:'42px', height:'42px',
                display:'flex', alignItems:'center', justifyContent:'center',
                color: canSend ? '#fff' : 'rgba(167,139,250,.35)',
                cursor: canSend ? 'pointer' : 'not-allowed',
                flexShrink:0,
                boxShadow: canSend ? '0 4px 16px rgba(91,33,182,.5)' : 'none',
              }}
              aria-label="Enviar"
            >
              <SendIcon/>
            </button>
          </div>
        </div>
      )}

      {/* ══════════ FAB ══════════ */}
      <div style={{ position:'fixed', bottom:'24px', right:'24px', zIndex:9999 }}>
        {/* Pulse ring — only when closed */}
        {!open && (
          <>
            <span style={{
              position:'absolute', inset:0, borderRadius:'50%',
              background:'rgba(124,58,237,.5)',
              animation:'lumiPulse 2s ease-out infinite',
            }}/>
            <span style={{
              position:'absolute', inset:0, borderRadius:'50%',
              background:'rgba(124,58,237,.3)',
              animation:'lumiPulse 2s ease-out infinite',
              animationDelay:'.6s',
            }}/>
          </>
        )}

        <button
          className="lumi-fab-btn"
          onClick={toggle}
          style={{
            position:'relative',
            width:'56px', height:'56px', borderRadius:'50%',
            background: open
              ? 'rgba(91,33,182,.9)'
              : 'linear-gradient(135deg,#7c3aed,#5b21b6)',
            border:'1.5px solid rgba(255,255,255,.15)',
            cursor:'pointer',
            boxShadow:'0 8px 28px rgba(91,33,182,.55)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff',
          }}
          aria-label={open ? 'Fechar Lumi' : 'Abrir Lumi — Assistente Virtual'}
          title="Lumi — Assistente Virtual"
        >
          <span key={fabKey} className="lumi-icon-anim">
            {open ? <CloseIcon/> : (
              <svg width="28" height="28" viewBox="0 0 56 56" fill="none">
                <path d="M17,9 L17,40 L39,40" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17,9 L19.2,15.5 L17,22 L14.8,15.5 Z" fill="white"/>
                <path d="M10.5,15.5 L17,13.3 L23.5,15.5 L17,17.7 Z" fill="white"/>
                <circle cx="17" cy="15.5" r="2.4" fill="white"/>
              </svg>
            )}
          </span>
        </button>
      </div>
    </>
  );
}
