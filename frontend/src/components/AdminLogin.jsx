'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Lock, Key, ArrowLeft, Loader2, X, UserRound } from 'lucide-react';
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
    <div className='main min-h-screen relative overflow-x-hidden bg-white selection:bg-blue-100'>
      <Toaster position="top-center" />

      {/* LEFT DECORATIVE SECTION */}
      <div className='hidden md:block MainBoll md:w-200 bg-linear-to-r from-blue-400 to-blue-900 min-h-250 rounded-r-full absolute mt-[-100px] shadow-2xl shadow-gray-400 z-0'>
        <div className='absolute w-150 h-90 flex flex-col justify-center items-center mt-60 ml-10'>
            <ShieldCheck size={60} className='text-white mb-4 opacity-90' />
            <h1 className='text-white font-extrabold text-6xl font-sans'>WELCOME</h1>
            <h2 className='text-white font-light text-sm tracking-[0.3em]' >ADMIN CONSOLE</h2>
            <div className='mt-6 text-center px-10'>
                <p className='text-white/80 text-xs font-medium uppercase tracking-widest'>Secure Access Protocol</p>
                <p className='text-white/80 text-xs font-medium mt-1'>Restricted Area: Authorized Personnel Only</p>
            </div>
        </div>
        
        <div className='boll-2 rounded-full w-90 h-90 bg-linear-to-r from-blue-800 to-blue-500 absolute mt-180 ml-[-90px] shadow-2xl shadow-black/40 '> 
        </div>
        <div className='boll-3 rounded-full w-70 h-70 bg-linear-to-r from-blue-500 to-blue-900 absolute mt-200 ml-100 shadow-2xl '>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className='bg-none min-h-screen max-w-full md:ml-250 p-8 flex items-center justify-center md:justify-start'>
          <div className='w-full max-w-150 relative'>
            
            <AnimatePresence mode="wait">
              {!showResetMenu ? (
                <motion.div 
                  key="login"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className='p-4 md:p-10'
                >
                  <div className='mb-10'>
                    <h1 className='text-4xl font-sans font-bold text-gray-800'>Sign in</h1>
                    <p className='font-mono text-xs text-gray-500 mt-2'>Enter credentials to access the Admin dashboard</p>
                  </div>

                  <form onSubmit={handleLogin} className='flex flex-col gap-4 w-full md:w-100'>
                    <div className='relative'>
                      <User className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                      <input 
                        type="text" 
                        placeholder='Admin Username' 
                        required 
                        className='w-full bg-gray-100 h-15 pl-12 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 transition-all'
                        onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      />
                    </div>

                    <div className='relative'>
                      <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                      <input 
                        type="password" 
                        placeholder='Password'  
                        required 
                        className='w-full bg-gray-100 h-15 pl-12 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 transition-all'
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      />
                    </div>

                    <div className='flex flex-row items-center justify-between px-2'>
                        <button 
                          type="button"
                          onClick={() => setShowRecoveryModal(true)}
                          className='text-xs text-blue-500 hover:underline cursor-pointer flex items-center gap-1 font-medium'
                        >
                          <Key size={12}/> System Recovery
                        </button>
                        <button 
                          type="button"
                          onClick={onBack}
                          className="text-xs text-zinc-400 hover:text-black transition-colors flex items-center justify-center gap-1.5 font-medium"
                        >
                          <ArrowLeft size={12} /> Return to Homepage
                        </button>
                    </div>

                    <button 
                      disabled={loading}
                      className='bg-blue-900 text-white font-bold h-14 rounded-2xl shadow-lg hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center mt-2'
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "Sign in"}
                    </button>
                    
                    <p className="mt-10 text-[10px] text-gray-400 text-center uppercase tracking-[0.2em] font-bold">
                      &copy; 2026 Secured Terminal Unit
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="reset"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className='p-10 w-full md:w-100'
                >
                  <div className='mb-8'>
                    <UserRound className="text-blue-600 mb-2" size={40} />
                    <h1 className='text-3xl font-bold text-gray-800'>Admin Config</h1>
                    <p className='text-xs text-gray-500'>Update system administrative access keys</p>
                  </div>
                  
                  <div className='flex flex-col gap-4'>
                    <input 
                      type="text" 
                      placeholder='New Admin Username' 
                      className='w-full bg-gray-100 h-14 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400'
                      onChange={(e) => setNewConfig({...newConfig, username: e.target.value})}
                    />
                    <input 
                      type="password" 
                      placeholder='New Admin Password' 
                      className='w-full bg-gray-100 h-14 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400'
                      onChange={(e) => setNewConfig({...newConfig, password: e.target.value})}
                    />
                    <button 
                      onClick={handleSaveNewConfig}
                      className='bg-blue-600 text-white font-bold h-14 rounded-2xl hover:bg-blue-700 transition-all'
                    >
                      {loading ? <Loader2 className="animate-spin mx-auto" /> : "Apply New Settings"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </div>

      {/* Recovery Modal */}
      <AnimatePresence>
        {showRecoveryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRecoveryModal(false)}
              className="absolute inset-0 bg-blue-900/20 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800">Identity Override</h3>
                <button onClick={() => setShowRecoveryModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-5">
                <p className="text-gray-500 text-sm italic font-medium">Please provide the master encryption key to authorize a credential reset.</p>
                <input 
                  type="password" 
                  autoFocus
                  placeholder="Master Secret Key"
                  className="w-full bg-gray-100 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 text-blue-600 font-mono tracking-widest"
                  onChange={(e) => setSecretKeyInput(e.target.value)}
                />
                <button 
                  onClick={handleVerifySecret}
                  className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Authorize Request"}
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