import React, { useState } from 'react';
import { Camera, Phone, MapPin, Home, ArrowRight, Loader2, User } from 'lucide-react';

const ProfileSetup = ({ userId, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    address: '',
    location: ''
  });

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
      ...formData,
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
        onComplete(data.profile);
      } else {
        alert("Setup failed: " + data.message);
      }
    } catch (err) { 
      alert("Server connection error"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200">
      <div className="text-center mb-8">
        {/* Profile Image Upload */}
        <label htmlFor="pfp-upload" className="block w-28 h-28 mx-auto mb-4 cursor-pointer group relative">
          <div className="w-full h-full rounded-full border-2 border-slate-200 shadow-sm overflow-hidden bg-slate-50 flex items-center justify-center transition-all hover:border-blue-500">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <User className="text-slate-300" size={40} />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg border-2 border-white">
            <Camera size={16} />
          </div>
          <input id="pfp-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
        </label>
        
        <h2 className="text-2xl font-bold text-slate-900">Complete Your Profile</h2>
        <p className="text-sm text-slate-500 mt-1">Please provide your contact details to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Phone Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              required 
              type="tel" 
              placeholder="e.g. +1 234 567 890" 
              className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900"
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            />
          </div>
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Address</label>
          <div className="relative">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              required 
              type="text" 
              placeholder="Street name and House number" 
              className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900"
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </div>

        {/* Location/City Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">City / Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              required 
              type="text" 
              placeholder="e.g. New York, NY" 
              className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900"
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
        </div>

        <button 
          disabled={loading} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>Save Profile & Continue <ArrowRight size={18} /></>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;