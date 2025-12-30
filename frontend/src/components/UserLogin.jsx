import React, { useState, useRef } from 'react';
import { User, Lock, Mail, Loader2, ArrowLeft, Car, Phone, MapPin, Home, Camera, UserCircle, Navigation } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import UserDashboard from './UserDashboard';

const FloatingInput = ({ icon: Icon, label, type, value, onChange, required, id, children }) => (
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
      className="block w-full px-12 py-4 text-sm text-slate-900 bg-white border border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 peer transition-all relative z-10"
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
    {children}
  </div>
);

const UserLogin = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('auth');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    location: ''
  });

  const toastStyle = {
    style: { borderRadius: '16px', background: '#1e293b', color: '#fff', padding: '12px 24px' },
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser", toastStyle);
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using OpenStreetMap's Nominatim (Free Reverse Geocoding)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const city = data.address.city || data.address.town || data.address.village || "";
          const postcode = data.address.postcode || "";
          const locationString = `${city}${city && postcode ? ', ' : ''}${postcode}`;

          setFormData(prev => ({ ...prev, location: locationString }));
          toast.success("Location found!", toastStyle);
        } catch (error) {
          toast.error("Failed to fetch address details", toastStyle);
        } finally {
          setLocLoading(false);
        }
      },
      (error) => {
        setLocLoading(false);
        toast.error("Location permission denied", toastStyle);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) return toast.error("Image too large (max 2MB)", toastStyle);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!isLogin && !preview) return toast.error("Please upload a profile photo!", toastStyle);
    
    setLoading(true);
    const endpoint = isLogin ? 'login' : 'signup';
    
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { ...formData, profileImage: preview, updatedAt: new Date() };

    try {
      const res = await fetch(`https://drivingschool-9b6b.onrender.com/api/users/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(isLogin ? "Welcome back!" : "Account created successfully!", toastStyle);
        setUserData(data.user);
        
        if (data.user.role === 'admin') {
          window.location.href = '/admin-dashboard';
          return;
        }
        setView('dashboard');
      } else {
        toast.error(data.message || "Authentication Failed", toastStyle);
      }
    } catch (err) { 
      toast.error("Server connection error", toastStyle); 
    } finally { 
      setLoading(false); 
    }
  };

  if (view === 'dashboard') return <UserDashboard user={userData} onLogout={() => setView('auth')} />;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <Toaster position="top-center" />
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/10 blur-[100px] rounded-full" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px] relative z-10">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
          
          <div className="flex flex-col items-center mb-6 text-center">
            {!isLogin ? (
              <div className="relative w-28 h-28 mb-4">
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-full rounded-full bg-slate-50 border-2 border-dashed border-blue-200 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-500 transition-all group"
                >
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <Camera size={28} />
                      <span className="text-[10px] font-bold uppercase mt-1">Photo</span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg border-2 border-white pointer-events-none">
                  <Camera size={12} />
                </div>
              </div>
            ) : (
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                <Car className="text-white" size={28} />
              </div>
            )}
            
            <h2 className="text-2xl font-black text-slate-900 italic uppercase">
              JOHN'S <span className="text-blue-600 not-italic">DRIVING</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              {isLogin ? "Welcome back, please login" : "Student Registration"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
            {!isLogin && (
              <FloatingInput id="fullName" icon={User} label="Full Name" type="text" required
                value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            )}
            
            <FloatingInput id="email" icon={Mail} label="Email Address" type="email" required
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            
            <FloatingInput id="password" icon={Lock} label="Password" type="password" required
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />

            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <FloatingInput id="phone" icon={Phone} label="Phone Number" type="tel" required
                  value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                
                <FloatingInput id="address" icon={Home} label="Address" type="text" required
                  value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                
                <FloatingInput id="location" icon={MapPin} label="City / Location" type="text" required
                  value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}>
                    <button 
                      type="button" 
                      onClick={getCurrentLocation}
                      disabled={locLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-30 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1 border border-blue-100 disabled:opacity-50"
                    >
                      {locLoading ? <Loader2 size={10} className="animate-spin" /> : <Navigation size={10} />}
                      Find
                    </button>
                </FloatingInput>
              </motion.div>
            )}

            <button disabled={loading} className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-bold transition-all flex items-center justify-center mt-2 shadow-lg shadow-slate-200">
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsLogin(!isLogin); setPreview(null); }} className="text-sm font-bold text-slate-500 hover:text-blue-600">
              {isLogin ? "New student? Create an account" : "Have an account? Sign in"}
            </button>
            <button onClick={onBack} className="block w-full mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
              ← Back to Website
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;