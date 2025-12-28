import React, { useState, useRef } from 'react';
import { Camera, Phone, MapPin, Home, ArrowRight, Loader2, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProfileSetup = ({ userId, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const locationRef = useRef(null);

  const toastStyle = {
    style: {
      borderRadius: '16px',
      background: '#1e293b',
      color: '#fff',
      padding: '12px 24px',
    },
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        return toast.error("Image too large (max 2MB)", toastStyle);
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview) return toast.error("Please upload a profile photo!", toastStyle);
    
    setLoading(true);
    const payload = {
      userId,
      phoneNumber: phoneRef.current.value,
      address: addressRef.current.value,
      location: locationRef.current.value,
      profileImage: preview 
    };

    try {
      const res = await fetch('https://drivingschool-9b6b.onrender.com/api/profiles/update-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Profile updated successfully!", toastStyle);
        onComplete(data.profile);
      } else {
        toast.error(data.message || "Setup failed", toastStyle);
      }
    } catch (err) { 
      toast.error("Server error. Please try again.", toastStyle); 
    } finally { 
      setLoading(false); 
    }
  };

  // Internal component for consistent input styling
  const SetupInput = ({ icon: Icon, placeholder, type, inputRef }) => (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-20">
        <Icon size={18} />
      </div>
      <input
        ref={inputRef}
        required
        type={type}
        placeholder={placeholder}
        className="w-full bg-slate-50/50 border border-slate-200 p-4 pl-12 rounded-2xl text-sm font-semibold outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-900 placeholder:text-slate-400"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/10 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white">
          
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <label htmlFor="pfp-upload" className="block w-28 h-28 mx-auto mb-4 cursor-pointer group relative">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center transition-all"
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="text-slate-300" size={64} />
                  )}
                </motion.div>
                <input id="pfp-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                
                <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                  <Camera size={14} />
                </div>
              </label>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Set Up <span className="text-blue-600">Profile</span>
            </h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Almost there! We need a few more details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <SetupInput 
              icon={Phone} 
              type="tel" 
              placeholder="Phone Number" 
              inputRef={phoneRef} 
            />
            <SetupInput 
              icon={Home} 
              type="text" 
              placeholder="Full Residential Address" 
              inputRef={addressRef} 
            />
            <SetupInput 
              icon={MapPin} 
              type="text" 
              placeholder="City / Province" 
              inputRef={locationRef} 
            />

            <motion.button 
              whileTap={{ scale: 0.98 }}
              disabled={loading} 
              className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Finish & Enter Portal <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>
          
          <p className="text-center mt-6 text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
            Your data is encrypted and secure
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;