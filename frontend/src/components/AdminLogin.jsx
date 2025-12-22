import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Lock, Key, ArrowLeft, RefreshCcw, Loader2, Save, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AdminDashboard from './AdminDashboard';

const AdminLogin = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showResetMenu, setShowResetMenu] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const [newConfig, setNewConfig] = useState({ username: '', password: '' });

  // --- SESSION PERSISTENCE LOGIC ---
  useEffect(() => {
    const checkSession = async () => {
      const savedUser = localStorage.getItem('adminUser');
      const sessionActive = localStorage.getItem('adminSession');

      if (sessionActive === 'active' && savedUser) {
        try {
          const res = await fetch('https://drivingschoolbackend.vercel.app/api/admin/verify-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: savedUser })
          });
          const data = await res.json();
          if (data.success) setIsLoggedIn(true);
          else handleLogout();
        } catch (err) {
          handleLogout();
        }
      }
    };
    checkSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminUser');
    setIsLoggedIn(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://drivingschoolbackend.vercel.app/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('adminSession', 'active');
        localStorage.setItem('adminUser', loginData.username);
        setIsLoggedIn(true);
        toast.success("ID VERIFIED");
      } else {
        toast.error("ACCESS DENIED");
      }
    } catch (err) {
      toast.error("SERVER OFFLINE");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySecret = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://drivingschoolbackend.vercel.app/api/admin/verify-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: secretKeyInput })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("OVERRIDE GRANTED");
        setShowRecoveryModal(false);
        setShowResetMenu(true); 
      } else {
        toast.error("KEY REJECTED");
      }
    } catch (err) {
      toast.error("DB ERROR");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewConfig = async () => {
    if (!newConfig.username || !newConfig.password) return toast.error("FIELDS REQUIRED");
    setLoading(true);
    try {
      const res = await fetch('https://drivingschoolbackend.vercel.app/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername: newConfig.username, newPassword: newConfig.password })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("SYSTEM UPDATED");
        setShowResetMenu(false);
        handleLogout(); // Force relogin with new credentials
      }
    } catch (err) {
      toast.error("UPDATE FAILED");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) return <AdminDashboard onLogout={handleLogout} />;

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950 flex items-center justify-center p-6 text-white">
      <Toaster position="bottom-left" toastOptions={{ style: { background: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.1)' }}} />

      <button onClick={onBack} className="absolute top-10 left-10 text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-2">
        <ArrowLeft size={16} /> EXIT PORTAL
      </button>

      {!showResetMenu ? (
        <div className="w-full max-w-sm animate-in fade-in zoom-in duration-500 text-center">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20"><ShieldCheck size={32} /></div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <input type="text" required placeholder="USERNAME" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={(e) => setLoginData({...loginData, username: e.target.value})} />
            <input type="password" required placeholder="PASSWORD" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
            <button type="submit" disabled={loading} className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 hover:text-white transition-all">
              {loading ? <Loader2 className="animate-spin mx-auto" size={18}/> : "Initialize Login"}
            </button>
          </form>
          <button onClick={() => setShowRecoveryModal(true)} className="mt-6 text-[9px] font-black uppercase text-slate-600 hover:text-blue-500 flex items-center justify-center gap-2 w-full"><RefreshCcw size={12} /> Recovery Protocol</button>
        </div>
      ) : (
        <div className="w-full max-w-sm animate-in zoom-in duration-500 text-center">
          <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"><RefreshCcw size={32} /></div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10 text-white">Reset System</h2>
          <div className="space-y-4 text-left">
            <input type="text" placeholder="NEW USERNAME" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-emerald-500" onChange={(e) => setNewConfig({...newConfig, username: e.target.value})} />
            <input type="password" placeholder="NEW PASSWORD" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-emerald-500" onChange={(e) => setNewConfig({...newConfig, password: e.target.value})} />
            <button onClick={handleSaveNewConfig} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"><Save size={16}/> Save Config</button>
          </div>
        </div>
      )}

      {showRecoveryModal && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[400] flex items-center justify-center p-6 text-center">
          <div className="bg-white text-slate-950 p-10 rounded-[3rem] w-full max-w-sm relative">
            <button onClick={() => setShowRecoveryModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500"><X size={20}/></button>
            <Key className="mx-auto mb-6 text-blue-600" size={36} />
            <h4 className="font-black uppercase italic text-2xl mb-8">Override</h4>
            <input type="password" autoFocus placeholder="•••••••" className="w-full bg-slate-100 rounded-2xl p-5 mb-6 text-center font-black text-xl tracking-[0.3em] outline-none" onChange={(e) => setSecretKeyInput(e.target.value)} />
            <button onClick={handleVerifySecret} className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 transition-all">VERIFY IDENTITY</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;