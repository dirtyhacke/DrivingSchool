import React, { useState, useRef } from 'react';
import { Camera, Phone, MapPin, Home, ArrowRight, Loader2 } from 'lucide-react';

const ProfileSetup = ({ userId, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const locationRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview) return alert("Please upload a profile photo!");
    
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
      if (data.success) onComplete(data.profile);
      else alert("Setup failed");
    } catch (err) { alert("Server error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
      <div className="text-center mb-8">
        <label htmlFor="pfp-upload" className="block w-28 h-28 mx-auto mb-4 cursor-pointer group relative">
          <div className="w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center transition-all hover:scale-105 active:scale-95">
            {preview ? <img src={preview} className="w-full h-full object-cover" /> : <Camera className="text-slate-300" size={32} />}
          </div>
          <input id="pfp-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-[10px] text-white font-bold">CHANGE</span>
          </div>
        </label>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Profile Setup</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input ref={phoneRef} required type="tel" placeholder="PHONE NUMBER" className="w-full bg-slate-50 border p-4 rounded-2xl text-sm font-bold outline-none focus:border-blue-600" />
        <input ref={addressRef} required type="text" placeholder="FULL ADDRESS" className="w-full bg-slate-50 border p-4 rounded-2xl text-sm font-bold outline-none focus:border-blue-600" />
        <input ref={locationRef} required type="text" placeholder="CITY / LOCATION" className="w-full bg-slate-50 border p-4 rounded-2xl text-sm font-bold outline-none focus:border-blue-600" />
        <button disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase text-xs flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : <>Finish & Enter <ArrowRight size={18} /></>}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;