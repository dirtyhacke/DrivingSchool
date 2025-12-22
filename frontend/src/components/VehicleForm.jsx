import React, { useState } from 'react';
import { X, Car, User, Phone, ShieldCheck, Send, Gauge, Loader2, CheckCircle2, ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const VehicleForm = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Track if upload finished
  const [formData, setFormData] = useState({
    registrationNumber: '', ownerName: '', primaryMobile: '',
    secondaryMobile: '', regValidity: '', insuranceValidity: '',
    pollutionValidity: '', permitValidity: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      registrationNumber: '', ownerName: '', primaryMobile: '',
      secondaryMobile: '', regValidity: '', insuranceValidity: '',
      pollutionValidity: '', permitValidity: ''
    });
    setIsSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('https://drivingschool-9b6b.onrender.com/api/vehicle-details/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        toast.success('ENTRY RECORDED', {
          style: {
            border: '1px solid #1e293b',
            padding: '16px',
            color: '#fff',
            background: '#0f172a',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '900',
          }
        });
        setIsSuccess(true); // Switch to success view instead of closing
      } else {
        toast.error(data.message || 'Registration Failed');
      }
    } catch (err) {
      toast.error('System Offline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-blue-600 p-8 text-white relative">
          <div className="relative flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl"><Car size={24} /></div>
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Vehicle Entry</h2>
                <p className="text-blue-100 text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">Registration Management</p>
              </div>
            </div>
            <button onClick={onClose} className="bg-black/10 hover:bg-black/20 p-3 rounded-full transition-all"><X size={20} /></button>
          </div>
        </div>

        {/* --- CONDITIONAL RENDERING --- */}
        {!isSuccess ? (
          <form className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 max-h-[70vh] overflow-y-auto bg-slate-50/30" onSubmit={handleSubmit}>
            <InputField label="Registration Number" name="registrationNumber" icon={<Gauge size={18}/>} placeholder="KL-60-A-1234" value={formData.registrationNumber} onChange={handleChange} required />
            <InputField label="Owner Name" name="ownerName" icon={<User size={18}/>} placeholder="Full Name" value={formData.ownerName} onChange={handleChange} required />
            <InputField label="Primary Mobile" name="primaryMobile" type="tel" icon={<Phone size={18}/>} placeholder="94xxx xxxxx" value={formData.primaryMobile} onChange={handleChange} required />
            <InputField label="Secondary Mobile" name="secondaryMobile" type="tel" icon={<Phone size={18}/>} placeholder="Optional" value={formData.secondaryMobile} onChange={handleChange} />

            <div className="md:col-span-2 mt-4 mb-1">
              <p className="text-[11px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2">
                 <ShieldCheck size={14} /> Validity & Compliance
              </p>
            </div>

            <DateInput label="Reg Validity" name="regValidity" value={formData.regValidity} onChange={handleChange} />
            <DateInput label="Insurance Validity" name="insuranceValidity" value={formData.insuranceValidity} onChange={handleChange} />
            <DateInput label="Pollution Validity" name="pollutionValidity" value={formData.pollutionValidity} onChange={handleChange} />
            <DateInput label="Permit Validity" name="permitValidity" value={formData.permitValidity} onChange={handleChange} />

            <button type="submit" disabled={loading} className="md:col-span-2 bg-slate-900 text-white py-5 rounded-[1.5rem] mt-6 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 font-black tracking-[0.2em] uppercase text-xs active:scale-95 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : <>Confirm & Save Entry <Send size={18} /></>}
            </button>
          </form>
        ) : (
          /* --- SUCCESS VIEW WITH BACK BUTTON --- */
          <div className="p-16 text-center animate-in zoom-in duration-500 bg-white">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Success!</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-10">
              Vehicle {formData.registrationNumber} is now in the registry.
            </p>
            
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button 
                onClick={resetForm}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
              >
                <Plus size={16} /> Add Another Vehicle
              </button>
              <button 
                onClick={onClose}
                className="w-full py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-components
const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-600 transition-colors">{icon}</div>
      <input className="w-full bg-white border border-slate-100 rounded-[1.5rem] p-4 pl-12 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-bold transition-all" {...props} />
    </div>
  </div>
);

const DateInput = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{label}</label>
    <input type="date" className="w-full bg-white border border-slate-100 rounded-[1.5rem] p-4 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-bold transition-all" required {...props} />
  </div>
);

export default VehicleForm;