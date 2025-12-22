import React, { useState } from 'react';
import { X, FileText, User, Phone, ClipboardCheck, Send, ShieldCheck, Loader2, CheckCircle2, ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const LicenseForm = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', primaryMobile: '', secondaryMobile: '', licenseNumber: '',
    lmvValidity: '', twoWheelerValidity: '', erikshaValidity: '', hmvValidity: '', miscValidity: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      fullName: '', primaryMobile: '', secondaryMobile: '', licenseNumber: '',
      lmvValidity: '', twoWheelerValidity: '', erikshaValidity: '', hmvValidity: '', miscValidity: ''
    });
    setIsSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('https://drivingschool-9b6b.onrender.com/api/license-details/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        toast.success('LICENSE RECORDED', {
          style: {
            padding: '16px',
            color: '#fff',
            background: '#0f172a',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '900',
            border: '1px solid #1e293b'
          }
        });
        setIsSuccess(true);
      } else {
        toast.error(data.message || 'Submission Failed');
      }
    } catch (err) {
      toast.error('Connection Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-emerald-600 p-8 text-white relative">
          <div className="relative flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl"><ShieldCheck size={24} /></div>
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">License Entry</h2>
                <p className="text-emerald-100 text-[10px] font-bold tracking-widest uppercase opacity-80">Document Record System</p>
              </div>
            </div>
            <button onClick={onClose} className="hover:rotate-90 transition-all duration-300 bg-black/10 p-3 rounded-full"><X size={20} /></button>
          </div>
        </div>

        {!isSuccess ? (
          <form className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 max-h-[70vh] overflow-y-auto bg-slate-50/30" onSubmit={handleSubmit}>
            <div className="md:col-span-2">
              <InputField label="Full Name" name="fullName" icon={<User size={18}/>} placeholder="As per ID" onChange={handleChange} value={formData.fullName} required />
            </div>
            <InputField label="Primary Mobile" name="primaryMobile" type="tel" icon={<Phone size={18}/>} placeholder="94xxx xxxxx" onChange={handleChange} value={formData.primaryMobile} required />
            <InputField label="Secondary Mobile" name="secondaryMobile" type="tel" icon={<Phone size={18}/>} placeholder="Emergency" onChange={handleChange} value={formData.secondaryMobile} />
            
            <div className="md:col-span-2">
              <InputField label="License Number" name="licenseNumber" icon={<FileText size={18}/>} placeholder="KL14 XXXXXXXXX" onChange={handleChange} value={formData.licenseNumber} required />
            </div>

            <div className="md:col-span-2 mt-4 mb-1 border-t border-slate-200 pt-4">
              <p className="text-[11px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2">
                 <ClipboardCheck size={14} /> Validity Details
              </p>
            </div>

            <DateInput label="LMV Validity" name="lmvValidity" onChange={handleChange} value={formData.lmvValidity} />
            <DateInput label="Two Wheeler" name="twoWheelerValidity" onChange={handleChange} value={formData.twoWheelerValidity} />
            <DateInput label="E-Riksha" name="erikshaValidity" onChange={handleChange} value={formData.erikshaValidity} />
            <DateInput label="HMV" name="hmvValidity" onChange={handleChange} value={formData.hmvValidity} />

            <button type="submit" disabled={loading} className="md:col-span-2 bg-slate-900 text-white py-5 rounded-[1.5rem] mt-6 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 font-black tracking-[0.2em] uppercase text-xs active:scale-95 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : <>Submit Record <Send size={18} /></>}
            </button>
          </form>
        ) : (
          <div className="p-16 text-center animate-in zoom-in duration-500 bg-white">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Record Saved</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-10">License {formData.licenseNumber} updated successfully.</p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button onClick={resetForm} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
                <Plus size={16} /> Add Another
              </button>
              <button onClick={onClose} className="w-full py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                <ArrowLeft size={16} /> Close Registry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors">{icon}</div>
      <input className="w-full bg-white border border-slate-100 rounded-[1.5rem] p-4 pl-12 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold transition-all" {...props} />
    </div>
  </div>
);

const DateInput = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{label}</label>
    <input type="date" className="w-full bg-white border border-slate-100 rounded-[1.5rem] p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold transition-all shadow-sm" {...props} />
  </div>
);

export default LicenseForm;