import React, { useState, useRef, useEffect } from 'react';
// Added 'Home' and 'ShieldCheck' to the imports to fix the error
import { User, Mail, Phone, MapPin, Lock, Trash2, AlertTriangle, Loader2, Camera, ShieldCheck, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const UserSettings = ({ user, darkMode, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(null); 
  const [dbData, setDbData] = useState({ user: user, profile: {} });
  const formRef = useRef();

  const toastStyle = {
    style: {
      borderRadius: '16px',
      background: darkMode ? '#1e293b' : '#0f172a',
      color: '#fff',
      padding: '12px 24px',
    },
  };

  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        const res = await fetch(`https://drivingschool-9b6b.onrender.com/api/profiles/${user._id}`);
        const data = await res.json();
        if (data.success) {
          setDbData({ user: data.user, profile: data.profile || {} });
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchFreshData();
  }, [user._id]);

  const handleUpdateClick = (e) => {
    e.preventDefault();
    if (formRef.current.reportValidity()) {
      setShowConfirm('update');
    }
  };

  const processAction = async () => {
    setLoading(true);
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    
    // Logic & IDs preserved exactly as original
    const endpoint = showConfirm === 'update' ? '/api/profiles/update-account' : `/api/profiles/${user._id}`;
    const method = showConfirm === 'update' ? 'POST' : 'DELETE';

    try {
      const res = await fetch(`https://drivingschool-9b6b.onrender.com${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: showConfirm === 'update' ? JSON.stringify({ userId: user._id, ...data }) : null
      });
      
      if (res.ok) {
        toast.success(showConfirm === 'update' ? "Profile updated successfully!" : "Account deleted", toastStyle);
        if (showConfirm === 'delete') onLogout();
      } else {
        toast.error("Action failed. Try again.", toastStyle);
      }
    } catch (err) { 
      toast.error("Network error occurred", toastStyle); 
    } finally { 
      setLoading(false); 
      setShowConfirm(null); 
    }
  };

  if (pageLoading) return <SkeletonLoader darkMode={darkMode} />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="pb-20"
    >
      <form 
        ref={formRef} 
        onSubmit={handleUpdateClick} 
        className={`${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'} border rounded-[2.5rem] p-6 lg:p-10 space-y-10 overflow-hidden relative`}
      >
        <div className="flex flex-col items-center justify-center space-y-4 pt-4 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600 rounded-full blur-2xl opacity-20 transition-opacity"></div>
            <img 
              src={dbData.profile?.profileImage || `https://ui-avatars.com/api/?name=${dbData.user.fullName}&background=2563eb&color=fff`} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-white relative z-10 shadow-xl"
            />
          </div>
          <div className="text-center">
            <h3 className={`font-bold text-2xl tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {dbData.user.fullName}
            </h3>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <ShieldCheck className="text-blue-500" size={14} />
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Verified Student</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <Input label="Full Name" name="fullName" icon={<User size={18}/>} required dark={darkMode} dValue={dbData.user.fullName} />
          <Input label="Email Address" name="email" type="email" icon={<Mail size={18}/>} required dark={darkMode} dValue={dbData.user.email} />
          <Input label="Phone Number" name="phoneNumber" icon={<Phone size={18}/>} required dark={darkMode} dValue={dbData.profile?.phoneNumber} />
          <Input label="Current Location" name="location" icon={<MapPin size={18}/>} required dark={darkMode} dValue={dbData.profile?.location} />
          <div className="md:col-span-2">
            <Input label="Full Residential Address" name="address" icon={<Home size={18}/>} required dark={darkMode} dValue={dbData.profile?.address} />
          </div>
          <div className={`md:col-span-2 border-t pt-8 ${darkMode ? 'border-white/10' : 'border-slate-100'}`}>
            <Input label="Update Password" name="password" type="password" icon={<Lock size={18}/>} dark={darkMode} placeholder="Leave blank to keep current" />
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full bg-slate-900 hover:bg-blue-600 text-white h-16 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all shadow-lg hover:shadow-blue-500/20"
          >
            Save Account Details
          </motion.button>
          
          <button 
            type="button" 
            onClick={() => setShowConfirm('delete')} 
            className="w-full text-red-500 font-bold text-[10px] uppercase tracking-widest py-4 border border-red-500/10 rounded-2xl hover:bg-red-500/5 transition-all"
          >
            Permanently Remove Profile
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`${darkMode ? 'bg-[#1e293b] border-white/10' : 'bg-white border-slate-200'} p-8 rounded-[2.5rem] max-w-sm w-full text-center border shadow-2xl relative z-[610]`}
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${showConfirm === 'delete' ? 'bg-red-50' : 'bg-blue-50'}`}>
                <AlertTriangle className={`${showConfirm === 'delete' ? 'text-red-500' : 'text-blue-500'}`} size={32} />
              </div>
              <h3 className={`font-bold text-xl mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {showConfirm === 'delete' ? 'Are you sure?' : 'Update Profile?'}
              </h3>
              <p className="text-xs font-medium text-slate-400 mb-8 leading-relaxed">
                 {showConfirm === 'delete' ? 'This action is permanent. All progress will be wiped.' : 'Your changes will be synced with John Driving database.'}
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={processAction} 
                  className={`h-14 rounded-2xl font-bold text-white text-xs tracking-widest transition-all ${showConfirm === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? <Loader2 className="animate-spin mx-auto"/> : 'Confirm & Proceed'}
                </button>
                <button 
                  onClick={() => setShowConfirm(null)} 
                  className={`h-14 font-bold text-xs uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Supporting Components (Defined outside)
const Input = ({label, name, type="text", icon, required, dark, dValue, placeholder}) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase text-slate-400 ml-3 tracking-widest">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
      <input 
        name={name} 
        type={type} 
        required={required} 
        defaultValue={dValue} 
        placeholder={placeholder} 
        className={`w-full p-4 pl-12 rounded-2xl outline-none border transition-all text-sm font-semibold ${dark ? 'bg-white/5 border-white/5 focus:border-blue-600 text-white' : 'bg-slate-50 border-slate-100 focus:border-blue-600 text-slate-900'}`} 
      />
    </div>
  </div>
);

const SkeletonLoader = ({ darkMode }) => (
  <div className={`animate-pulse border rounded-[2.5rem] p-6 lg:p-10 space-y-10 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
    <div className="flex flex-col items-center space-y-4">
      <div className="w-32 h-32 rounded-full bg-slate-200"></div>
      <div className="h-4 w-32 rounded-lg bg-slate-200"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`${i === 4 ? 'md:col-span-2' : ''} space-y-2`}>
          <div className="h-2 w-16 rounded bg-slate-100"></div>
          <div className="h-14 rounded-2xl bg-slate-50"></div>
        </div>
      ))}
    </div>
  </div>
);

export default UserSettings;