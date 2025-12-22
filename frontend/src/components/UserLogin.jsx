import React, { useState, useRef } from 'react';
import { User, Lock, Mail, Loader2, ArrowLeft, Car, MapPin } from 'lucide-react';
import UserDashboard from './UserDashboard';
import ProfileSetup from './ProfileSetup';

const UserLogin = ({ onBack }) => {
  const [view, setView] = useState('login'); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passRef = useRef(null);
  const nameRef = useRef(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = view === 'login' ? 'login' : 'signup';
    
    try {
      const res = await fetch(`http://localhost:8080/api/users/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailRef.current.value,
          password: passRef.current.value,
          ...(view === 'signup' && { fullName: nameRef.current.value })
        })
      });
      const data = await res.json();
      
      if (data.success) {
        // 1. Save user info and ID
        localStorage.setItem('userId', data.user._id);
        setUserData(data.user);

        // 2. Logic: Where to go next?
        if (data.user.role === 'admin') {
          // If Admin, go to Admin Dashboard (or reload to trigger admin routes)
          window.location.href = '/admin-dashboard';
          return;
        }

        if (view === 'signup') {
          // NEW ACCOUNT: Always show Profile Setup first
          setView('setup');
        } else {
          // LOGIN: Go straight to User Dashboard (Skip Setup)
          setView('dashboard');
        }
      } else {
        alert(data.message || "Authentication Failed");
      }
    } catch (err) { 
      alert("Connection to server failed. Is the backend running?"); 
    } finally { 
      setLoading(false); 
    }
  };

  // --- VIEW RENDERING ---

  if (view === 'dashboard') {
    return <UserDashboard user={userData} onLogout={() => {
      localStorage.removeItem('userId');
      setView('login');
    }} />;
  }

  if (view === 'setup') {
    return (
      <div className="fixed inset-0 z-[500] bg-slate-950 flex items-center justify-center p-6 overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent opacity-50"></div>
        <div className="relative z-10 w-full flex justify-center">
            <ProfileSetup 
              userId={userData?._id || localStorage.getItem('userId')} 
              onComplete={(profileData) => {
                  setUserData({ ...userData, profile: profileData });
                  setView('dashboard');
              }} 
            />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] bg-[#020617] flex items-center justify-center p-6 overflow-y-auto font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/[0.08] p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-8">
          
          <div className="text-center relative">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
              <Car className="text-white" size={38} />
            </div>
            <h1 className="text-white text-[11px] font-black uppercase tracking-[0.4em] mb-1 opacity-60">Malakallu Branch</h1>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              John's <span className="text-blue-500">Driving</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2 opacity-40">
                <MapPin size={12} className="text-blue-400" />
                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Premium Academy</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            {view === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input ref={nameRef} type="text" required className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500/50 text-white font-bold transition-all" placeholder="Enter Name" />
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input ref={emailRef} type="email" required className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500/50 text-white font-bold transition-all" placeholder="name@email.com" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input ref={passRef} type="password" required className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500/50 text-white font-bold transition-all" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-[0_10px_30px_rgba(37,99,235,0.2)] transition-all active:scale-95 flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" size={24} /> : (view === 'login' ? 'Login' : 'Begin Training')}
            </button>
          </form>

          <div className="flex flex-col items-center gap-4">
            <button type="button" onClick={() => setView(view === 'login' ? 'signup' : 'login')} className="text-[10px] font-black uppercase text-white/30 hover:text-blue-400 tracking-widest transition-colors">
              {view === 'login' ? "Register New Student" : "Return to Sign In"}
            </button>
            
            <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase text-white/10 hover:text-white/40 transition-all pt-2">
               <ArrowLeft size={14} /> Close Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;