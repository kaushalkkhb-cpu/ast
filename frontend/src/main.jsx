import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, Bot, BriefcaseBusiness, Gauge, LayoutDashboard, LockKeyhole, LogOut, Newspaper, Settings2, ShieldCheck, TrendingUp, Wallet, Eye, EyeOff } from 'lucide-react';
import './style.css';

const API = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const markets = [{symbol:'XAUUSD',name:'Gold / US Dollar'},{symbol:'NIFTY',name:'Nifty 50'},{symbol:'BANKNIFTY',name:'Nifty Bank'}];

function AuthScreen({onLogin}) {
  const [mode,setMode]=useState('login');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const [showPassword,setShowPassword]=useState(false);
  async function submit(e){
    e.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const endpoint = mode==='register' ? '/api/auth/register' : '/api/auth/login';
      const response=await fetch(API+endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.detail || 'Request failed. Please try again.');
      if(mode==='register'){setMode('login');setMessage('Account created. Sign in with your email and password.');setPassword('');}
      else {sessionStorage.setItem('astpro_token',data.access_token);onLogin(data.access_token);}
    } catch(err){setError(err.message || 'Unable to connect to AST PRO API.');}
    finally{setBusy(false);}
  }
  return <div className="auth-wrap"><div className="auth-card"><div className="brand auth-brand"><b>A</b><span><strong>AST PRO</strong><small>AI SMART TRADING TERMINAL</small></span></div><div className="auth-kicker">YOUR TRADING WORKSPACE</div><h1>{mode==='login'?'Welcome back':'Create your account'}</h1><p className="auth-sub">{mode==='login'?'Sign in to access your secure trading dashboard.':'Register to create your AST PRO account.'}</p>
  <div className="auth-tabs"><button className={mode==='login'?'selected':''} onClick={()=>{setMode('login');setError('');setMessage('')}}>Sign in</button><button className={mode==='register'?'selected':''} onClick={()=>{setMode('register');setError('');setMessage('')}}>Register</button></div>
  <form onSubmit={submit}><label>Email address</label><input type="email" autoComplete="email" required maxLength="254" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/><label>Password</label><div className="password-field"><input type={showPassword?'text':'password'} autoComplete={mode==='login'?'current-password':'new-password'} required minLength="10" maxLength="128" placeholder="At least 10 characters" value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" aria-label="Toggle password visibility" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff/>:<Eye/>}</button></div>{mode==='register'&&<small className="field-help">Use at least 10 characters.</small>}{error&&<div className="form-error">{error}</div>}{message&&<div className="form-success">{message}</div>}<button className="primary-btn" disabled={busy}>{busy?'Please wait…':mode==='login'?'Sign in securely':'Create account'}</button></form>
  <div className="auth-safe"><LockKeyhole/><span>Your password is securely hashed by the API. Never share your password or broker API keys.</span></div></div><div className="auth-foot">AST PRO · PAPER MODE ONLY · LIVE TRADING DISABLED</div></div>;
}

function Dashboard({token,onLogout}) {
 const [dashboard,setDashboard]=useState(null); const [loadError,setLoadError]=useState('');
 useEffect(()=>{let active=true;fetch(API+'/api/dashboard',{headers:{Authorization:'Bearer '+token}}).then(async r=>{if(!r.ok)throw new Error('Could not load dashboard');return r.json()}).then(d=>{if(active)setDashboard(d)}).catch(e=>{if(active)setLoadError(e.message)});return()=>{active=false}},[token]);
 const stats=[{label:'Account balance',value:'$10,000.00',note:'Sample account',icon:Wallet},{label:"Today's P&L",value:'$0.00',note:'No live orders',icon:TrendingUp},{label:'Open positions',value:'0',note:'Paper mode',icon:BriefcaseBusiness},{label:'Win rate',value:'—',note:'Awaiting trade history',icon:Gauge}];
 return <div className="shell"><aside className="sidebar"><div className="brand"><b>A</b><span><strong>AST PRO</strong><small>SMART TRADING TERMINAL</small></span></div><label>WORKSPACE</label><nav><a className="active"><LayoutDashboard/>Dashboard</a><a><Activity/>Market Watch</a><a><Bot/>AI Signals</a><a><BriefcaseBusiness/>Portfolio</a><a><Newspaper/>News & Events</a></nav><label>SYSTEM</label><nav><a><ShieldCheck/>Risk Controls</a><a><Settings2/>Settings</a></nav><button className="logout" onClick={onLogout}><LogOut/>Sign out</button><div className="secure"><LockKeyhole/>Secure workspace</div></aside><main><header><div><small>OVERVIEW</small><h1>Trading dashboard</h1></div><span className="mode">● PAPER MODE</span></header><section className="hero"><small>AI SMART TRADING TERMINAL</small><h2>Trade with clarity.<br/><em>Stay in control.</em></h2><p>Your trading workspace is being prepared. Connect verified market data to unlock live insights.</p></section>{loadError&&<div className="form-error">{loadError}</div>}<section className="stats">{stats.map(({label,value,note,icon:Icon})=><article key={label}><div>{label}<Icon/></div><strong>{value}</strong><small>{note}</small></article>)}</section><section className="panels"><article className="panel"><h3>Market watch</h3><p>Instruments on your watchlist</p>{markets.map(m=><div className="row" key={m.symbol}><b>{m.symbol}</b><span>{m.name}</span><strong>—</strong></div>)}</article><article className="panel"><h3>AI signal centre</h3><p>Analysis status</p><div className="empty"><Bot/><b>AI engine not connected</b><span>Signals will appear after market data and strategy validation are configured.</span></div></article></section><section className="notice"><ShieldCheck/><div><b>Safety first</b><p>Demo interface only. Market values are sample placeholders. No broker is connected and no real orders can be placed. Live trading stays disabled until testing and risk controls are verified.</p></div></section><footer>© 2026 AST PRO <span>{dashboard?.mode || 'PAPER / DEMO'} · Built for disciplined trading</span></footer></main></div>;
}
function App(){
 const [token,setToken]=useState(()=>sessionStorage.getItem('astpro_token'));
 const [checking,setChecking]=useState(Boolean(sessionStorage.getItem('astpro_token')));
 useEffect(()=>{if(!token){setChecking(false);return;}fetch(API+'/api/auth/me',{headers:{Authorization:'Bearer '+token}}).then(r=>{if(!r.ok)throw new Error('Session expired');return r.json()}).then(()=>setChecking(false)).catch(()=>{sessionStorage.removeItem('astpro_token');setToken(null);setChecking(false)})},[token]);
 function logout(){sessionStorage.removeItem('astpro_token');setToken(null)}
 if(checking)return <div className="loading">Checking secure session…</div>;
 return token?<Dashboard token={token} onLogout={logout}/>:<AuthScreen onLogin={setToken}/>;
}
createRoot(document.getElementById('root')).render(<App/>);
