import React, { useState } from 'react';
import { User, Lock, Mail, Loader2, ArrowLeft, Car } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion'; // Added Framer Motion
import UserDashboard from './UserDashboard';
import ProfileSetup from './ProfileSetup';

const FloatingInput = ({ icon: Icon, label, type, value, onChange, required, id }) => (
  <div className="relative mb-5 group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-20 pointer-events-none">
      <Icon size={18} />
    </div>
    <input
      id={id}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder=" " 
      className="block w-full px-12 py-4 text-sm text-slate-900 bg-white/50 border border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 peer transition-all relative z-10"
    />
    <label
      htmlFor={id}
      className="absolute text-sm text-slate-500 duration-200 transform -translate-y-4 scale-75 top-2 z-30 origin-[0] bg-white px-2 
      peer-focus:px-2 peer-focus:text-blue-600 
      peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
      peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 
      left-10 pointer-events-none transition-all"
    >
      {label}
    </label>
  </div>
);

const UserLogin = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('auth');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const toastStyle = {
    style: {
      borderRadius: '16px',
      background: '#1e293b',
      color: '#fff',
      padding: '12px 24px',
    },
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? 'login' : 'signup';
    
    try {
      const res = await fetch(`https://drivingschool-9b6b.onrender.com/api/users/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(isLogin ? "Welcome back!" : "Welcome to the family!", toastStyle);
        localStorage.setItem('userId', data.user._id);
        setUserData(data.user);
        if (data.user.role === 'admin') {
          window.location.href = '/admin-dashboard';
          return;
        }
        isLogin ? setView('dashboard') : setView('setup');
      } else {
        toast.error(data.message || "Authentication Failed", toastStyle);
      }
    } catch (err) { 
      toast.error("Network error. Try again.", toastStyle); 
    } finally { 
      setLoading(false); 
    }
  };

  if (view === 'dashboard') return <UserDashboard user={userData} onLogout={() => setView('auth')} />;
  if (view === 'setup') return <ProfileSetup userId={userData?._id} onComplete={() => setView('dashboard')} />;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Modern Background Blur Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/10 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white">
          
          <div className="flex flex-col items-center mb-8 text-center">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-blue-500/20"
            >
              <Car className="text-white" size={28} />
            </motion.div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">
              JOHN'S <span className="text-blue-600">DRIVING</span>
            </h2>
          </div>

          <form onSubmit={handleAuth} className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ x: isLogin ? -20 : 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isLogin ? 20 : -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {!isLogin && (
                  <FloatingInput 
                    id="fullName"
                    icon={User}
                    label="Full Name"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                )}
                
                <FloatingInput 
                  id="email"
                  icon={Mail}
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />

                <FloatingInput 
                  id="password"
                  icon={Lock}
                  label="Password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </motion.div>
            </AnimatePresence>

            <motion.button 
              whileTap={{ scale: 0.97 }}
              type="submit" 
              disabled={loading} 
              className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
            </motion.button>
          </form>

          <div className="mt-8 space-y-4 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              {isLogin ? "New student? Create an account" : "Have an account? Sign in"}
            </button>
            
            <div className="pt-6 border-t border-slate-100">
              <button 
                onClick={onBack} 
                className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
              >
                 <ArrowLeft size={14} /> Back to Website
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;