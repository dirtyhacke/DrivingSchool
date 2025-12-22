import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Trash2, AlertTriangle, Loader2, Camera } from 'lucide-react';

const UserSettings = ({ user, darkMode, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // Initial fetch loading
  const [showConfirm, setShowConfirm] = useState(null); 
  const [dbData, setDbData] = useState({ user: user, profile: {} });
  const formRef = useRef();

  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/profiles/${user._id}`);
        const data = await res.json();
        if (data.success) {
          setDbData({ user: data.user, profile: data.profile || {} });
        }
      } catch (err) {
        console.error("Error fetching image from DB", err);
      } finally {
        setPageLoading(false); // Stop skeleton after fetch
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
    
    const endpoint = showConfirm === 'update' ? '/api/profiles/update-account' : `/api/profiles/${user._id}`;
    const method = showConfirm === 'update' ? 'POST' : 'DELETE';

    try {
      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: showConfirm === 'update' ? JSON.stringify({ userId: user._id, ...data }) : null
      });
      if (res.ok) {
        alert(showConfirm === 'update' ? "Database Updated!" : "Account Deleted");
        if (showConfirm === 'delete') onLogout();
      }
    } catch (err) { alert("Server Error"); }
    finally { setLoading(false); setShowConfirm(null); }
  };

  // --- RENDER SKELETON IF LOADING ---
  if (pageLoading) return <SkeletonLoader darkMode={darkMode} />;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 pb-20">
      <form ref={formRef} onSubmit={handleUpdateClick} className={`${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl'} border rounded-[3rem] p-6 lg:p-10 space-y-10`}>
        
        <div className="flex flex-col items-center justify-center space-y-4 pt-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600 rounded-full blur-3xl opacity-10"></div>
            <img 
              src={dbData.profile?.profileImage || `https://ui-avatars.com/api/?name=${dbData.user.fullName}&background=2563eb&color=fff`} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 relative z-10 shadow-2xl"
            />
          </div>
          <div className="text-center">
            <h3 className="font-black uppercase italic tracking-tighter text-xl leading-none">{dbData.user.fullName}</h3>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mt-2">Active Student</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" name="fullName" icon={<User/>} required dark={darkMode} dValue={dbData.user.fullName} />
          <Input label="Email Address" name="email" type="email" icon={<Mail/>} required dark={darkMode} dValue={dbData.user.email} />
          <Input label="Phone Number" name="phoneNumber" icon={<Phone/>} required dark={darkMode} dValue={dbData.profile?.phoneNumber} />
          <Input label="Location" name="location" icon={<MapPin/>} required dark={darkMode} dValue={dbData.profile?.location} />
          <div className="md:col-span-2">
            <Input label="Home Address" name="address" icon={<MapPin/>} required dark={darkMode} dValue={dbData.profile?.address} />
          </div>
          <div className="md:col-span-2 border-t border-white/10 pt-8">
            <Input label="Change Password" name="password" type="password" icon={<Lock/>} dark={darkMode} placeholder="Enter to update password" />
          </div>
        </div>

        <div className="space-y-4">
          <button type="submit" className="w-full bg-blue-600 text-white h-16 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-600/30 active:scale-95 transition-all">
            Save All Changes
          </button>
          <button type="button" onClick={() => setShowConfirm('delete')} className="w-full text-red-500 font-black text-[10px] uppercase tracking-widest py-4 border border-red-500/20 rounded-2xl hover:bg-red-500/5 transition-all">
            Delete Profile
          </button>
        </div>
      </form>

      {/* --- CONFIRMATION MODAL --- */}
      {showConfirm && (
        <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'} p-8 rounded-[2.5rem] max-w-sm w-full text-center border shadow-2xl animate-in zoom-in duration-200`}>
            <AlertTriangle className={`mx-auto mb-6 ${showConfirm === 'delete' ? 'text-red-500' : 'text-blue-500'}`} size={32} />
            <h3 className="font-black uppercase italic text-xl mb-2">{showConfirm === 'delete' ? 'Delete Data?' : 'Push Update?'}</h3>
            <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest mb-8">
               {showConfirm === 'delete' ? 'This will wipe your John Driving profile forever.' : 'Save these details to your student record?'}
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={processAction} className={`h-14 rounded-2xl font-black text-white text-[10px] tracking-widest ${showConfirm === 'delete' ? 'bg-red-600' : 'bg-blue-600'}`}>
                {loading ? <Loader2 className="animate-spin mx-auto"/> : 'Yes, Proceed'}
              </button>
              <button onClick={() => setShowConfirm(null)} className="h-14 font-black text-[10px] uppercase opacity-40">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SKELETON COMPONENT ---
const SkeletonLoader = ({ darkMode }) => (
  <div className={`animate-pulse border rounded-[3rem] p-6 lg:p-10 space-y-10 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
    <div className="flex flex-col items-center space-y-4">
      <div className={`w-32 h-32 rounded-full ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
      <div className={`h-4 w-32 rounded ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
      <div className={`h-2 w-20 rounded ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`${i === 4 ? 'md:col-span-2' : ''} space-y-2`}>
          <div className={`h-2 w-16 rounded ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
          <div className={`h-14 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}></div>
        </div>
      ))}
    </div>
  </div>
);

const Input = ({label, name, type="text", icon, required, dark, dValue, placeholder}) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase opacity-40 ml-3 tracking-widest">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20">{icon}</div>
      <input 
        name={name} 
        type={type} 
        required={required} 
        defaultValue={dValue} 
        placeholder={placeholder} 
        className={`w-full p-5 pl-12 rounded-2xl outline-none border transition-all text-sm font-bold ${dark ? 'bg-white/5 border-white/5 focus:border-blue-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'}`} 
      />
    </div>
  </div>
);

export default UserSettings;