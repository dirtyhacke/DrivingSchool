import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Lock, Key, ArrowLeft, RefreshCcw, Loader2, Save, X, UserRound, UserRoundCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion'; // Added for fluid transitions
import AdminDashboard from './AdminDashboard';

const AdminLogin = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showResetMenu, setShowResetMenu] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const [newConfig, setNewConfig] = useState({ username: '', password: '' });

  // --- SESSION PERSISTENCE LOGIC (Unchanged) ---
  useEffect(() => {
    const checkSession = async () => {
      const savedUser = localStorage.getItem('adminUser');
      const sessionActive = localStorage.getItem('adminSession');

      if (sessionActive === 'active' && savedUser) {
        try {
          const res = await fetch('https://drivingschool-9b6b.onrender.com/api/admin/verify-session', {
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
      const res = await fetch('https://drivingschool-9b6b.onrender.com/api/admin/login', {
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
      const res = await fetch('https://drivingschool-9b6b.onrender.com/api/admin/verify-secret', {
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
      const res = await fetch('https://drivingschool-9b6b.onrender.com/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername: newConfig.username, newPassword: newConfig.password })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("SYSTEM UPDATED");
        setShowResetMenu(false);
        handleLogout(); 
      }
    } catch (err) {
      toast.error("UPDATE FAILED");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) return <AdminDashboard onLogout={handleLogout} />;

  return (
    <div className="fixed inset-0 z-[300] bg-[#020617] flex items-center justify-center p-6 text-white overflow-hidden">
      {/* Dark Mode Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full" />

      <Toaster position="bottom-left" toastOptions={{ style: { background: '#1e293b', color: '#fff', fontSize: '11px', fontWeight: '900', border: '1px solid rgba(255,255,255,0.1)' }}} />

      <button 
        onClick={onBack} 
        className="absolute top-10 left-10 text-[10px] font-bold uppercase text-slate-500 hover:text-white flex items-center gap-2 transition-all tracking-widest"
      >
        <ArrowLeft size={16} /> Back To Website
      </button>

      <AnimatePresence mode="wait">
        {!showResetMenu ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm text-center relative z-10"
          >
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/40">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Secure Access</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mb-10">Admin Control Unit</p>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  required 
                  placeholder="USERNAME" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm font-bold outline-none focus:border-blue-600 transition-all" 
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})} 
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  required 
                  placeholder="PASSWORD" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm font-bold outline-none focus:border-blue-600 transition-all" 
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
                />
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading} 
                className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={18}/> : "Authorize System"}
              </motion.button>
            </form>

            <button 
              onClick={() => setShowRecoveryModal(true)} 
              className="mt-8 text-[9px] font-bold uppercase text-slate-500 hover:text-red-500 flex items-center justify-center gap-2 w-full transition-colors tracking-widest"
            >
              <RefreshCcw size={12} /> System Override / Reset
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="reset"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-sm text-center relative z-10"
          >
            <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/40">
              <UserRound size={32} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-10 text-white">Config Update</h2>
            <div className="space-y-4 text-left">
              <input 
                type="text" 
                placeholder="NEW USERNAME" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all" 
                onChange={(e) => setNewConfig({...newConfig, username: e.target.value})} 
              />
              <input 
                type="password" 
                placeholder="NEW PASSWORD" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all" 
                onChange={(e) => setNewConfig({...newConfig, password: e.target.value})} 
              />
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveNewConfig} 
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20"
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : <><Save size={16}/> Commit Changes</>}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recovery Modal */}
      <AnimatePresence>
        {showRecoveryModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRecoveryModal(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white text-slate-950 p-10 rounded-[2.5rem] w-full max-w-sm relative z-10 shadow-2xl shadow-blue-500/10"
            >
              <button 
                onClick={() => setShowRecoveryModal(false)} 
                className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"
              >
                <X size={20}/>
              </button>
              
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Key className="text-blue-600" size={32} />
              </div>
              
              <h4 className="font-black uppercase italic text-xl mb-2">Master Key</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Enter administrative secret</p>
              
              <input 
                type="password" 
                autoFocus 
                placeholder="•••••••" 
                className="w-full bg-slate-100 rounded-2xl p-5 mb-6 text-center font-black text-xl tracking-[0.3em] outline-none border-2 border-transparent focus:border-blue-600 transition-all" 
                onChange={(e) => setSecretKeyInput(e.target.value)} 
              />
              
              <button 
                onClick={handleVerifySecret} 
                className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 transition-all shadow-lg"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={18}/> : "Validate Override"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLogin;