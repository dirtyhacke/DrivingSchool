'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Lock, Key, ArrowLeft, RefreshCcw, Loader2, Save, X, UserRound, LayoutDashboard } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AdminDashboard from './AdminDashboard'; 

const AdminLogin = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showResetMenu, setShowResetMenu] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const [newConfig, setNewConfig] = useState({ username: '', password: '' });

  // --- LOGIC (UNTOUCHED) ---
  useEffect(() => {
    const checkSession = async () => {
      if (typeof window !== 'undefined') {
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
        toast.success("Identity Verified");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (err) {
      toast.error("Connection Failed");
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
        toast.success("Access Granted");
        setShowRecoveryModal(false);
        setShowResetMenu(true); 
      } else {
        toast.error("Invalid Secret Key");
      }
    } catch (err) {
      toast.error("Verification Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewConfig = async () => {
    if (!newConfig.username || !newConfig.password) return toast.error("All fields required");
    setLoading(true);
    try {
      const res = await fetch('https://drivingschool-9b6b.onrender.com/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername: newConfig.username, newPassword: newConfig.password })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("System Updated");
        setShowResetMenu(false);
        handleLogout(); 
      }
    } catch (err) {
      toast.error("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) return <AdminDashboard onLogout={handleLogout} />;

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-zinc-100 selection:bg-blue-500/30">
      
      <Toaster position="bottom-right" toastOptions={{ 
        style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } 
      }} />

      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[400px] z-10">
        
        {/* Header / Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 mb-4">
            <ShieldCheck size={28} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Console</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Authentication Required</p>
        </div>

        <AnimatePresence mode="wait">
          {!showResetMenu ? (
            <motion.div
              key="login-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl shadow-2xl backdrop-blur-sm"
            >
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                      type="text" 
                      required 
                      placeholder="Enter username" 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-700"
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••" 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-700"
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 h-11 mt-2 shadow-[0_1px_10px_rgba(255,255,255,0.1)]"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-col gap-3">
                <button 
                  onClick={() => setShowRecoveryModal(true)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Key size={12} /> System Recovery Protocol
                </button>
                <button 
                  onClick={onBack}
                  className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 font-medium"
                >
                  <ArrowLeft size={12} /> Return to Homepage
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reset-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-emerald-900/30 p-8 rounded-2xl shadow-2xl"
            >
              <div className="text-center mb-6">
                <UserRound className="mx-auto text-emerald-500 mb-2" size={32} />
                <h2 className="text-xl font-bold">Configure Access</h2>
                <p className="text-zinc-500 text-xs">Update your administrative credentials</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="New Username" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none transition-all"
                  onChange={(e) => setNewConfig({...newConfig, username: e.target.value})}
                />
                <input 
                  type="password" 
                  placeholder="New Password" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none transition-all"
                  onChange={(e) => setNewConfig({...newConfig, password: e.target.value})}
                />
                <button 
                  onClick={handleSaveNewConfig}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Apply New Settings"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <p className="mt-10 text-[11px] text-zinc-600 text-center uppercase tracking-[0.2em] font-semibold">
          &copy; 2026 Secured Terminal Unit
        </p>
      </div>

      {/* Modern Recovery Modal */}
      <AnimatePresence>
        {showRecoveryModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRecoveryModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-[400px] z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="font-bold">Identity Override</h3>
                <button onClick={() => setShowRecoveryModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-zinc-400 text-sm leading-relaxed">Provide the master encryption key to authorize a credential reset.</p>
                <input 
                  type="password" 
                  autoFocus
                  placeholder="Master Secret"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 outline-none focus:border-blue-500 text-blue-400 font-mono tracking-widest"
                  onChange={(e) => setSecretKeyInput(e.target.value)}
                />
                <button 
                  onClick={handleVerifySecret}
                  className="w-full bg-zinc-100 text-black hover:bg-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Authorize Request"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLogin;