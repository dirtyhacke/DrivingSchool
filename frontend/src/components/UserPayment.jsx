import React, { useState, useEffect } from 'react';
import { IndianRupee, QrCode, Phone, Smartphone, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const UserPayment = ({ darkMode, userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await fetch(`https://drivingschool-9b6b.onrender.com/api/user-payments/my-status/${userId}`);
        const result = await res.json();
        if (result.success) setData(result.data);
      } catch (err) { console.error("Fetch error:", err); }
      setLoading(false);
    };
    fetchPayment();
  }, [userId]);

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  if (!data) return (
    <div className="p-10 text-center opacity-40 border-2 border-dashed border-white/10 rounded-[2rem]">
      <AlertCircle className="mx-auto mb-2" />
      <p className="text-[10px] font-black uppercase tracking-widest">No Payment Record Found</p>
    </div>
  );

  // UPI Deep Link Generation
  const upiUrl = `upi://pay?pa=${data.adminUpiId}&pn=DrivingSchool&am=${data.remainingAmount}&cu=INR`;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* LEDGER CARD */}
      <div className={`p-8 rounded-[2.5rem] border ${darkMode ? 'bg-white/[0.02] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'}`}>
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Total Outstanding</p>
            <h3 className="text-5xl font-black italic tracking-tighter">₹{data.remainingAmount}</h3>
            
            {/* NEW: LAST UPDATED DATE */}
            <div className="flex items-center gap-2 mt-3 opacity-40">
                <RefreshCw size={10} className="animate-spin-slow" />
                <p className="text-[9px] font-bold uppercase tracking-wider">
                    Synced: {new Date(data.lastUpdated).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
          </div>
          
          <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
            data.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
          }`}>
            {data.status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-5 rounded-3xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
            <p className="text-[8px] font-black uppercase opacity-40 mb-1">Category</p>
            <p className="text-sm font-bold">{data.vehicleCategory}</p>
          </div>
          <div className={`p-5 rounded-3xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
            <p className="text-[8px] font-black uppercase opacity-40 mb-1">Paid So Far</p>
            <p className="text-sm font-bold text-emerald-500">₹{data.paidAmount}</p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* UPI Intent Button */}
        <button 
          onClick={() => window.location.href = upiUrl}
          className="flex items-center gap-4 p-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <div className="bg-white/20 p-3 rounded-2xl"><Smartphone size={20}/></div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Pay with App</p>
            <p className="text-[8px] font-bold opacity-60 uppercase mt-1">GPay / PhonePe / Paytm</p>
          </div>
        </button>

        {/* QR Trigger Button */}
        <button 
          onClick={() => setShowQr(true)}
          className={`flex items-center gap-4 p-6 border rounded-[2rem] transition-all active:scale-95 ${darkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
        >
          <div className="bg-purple-500/20 p-3 rounded-2xl text-purple-500"><QrCode size={20}/></div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">View QR Code</p>
            <p className="text-[8px] font-bold opacity-40 uppercase mt-1">Scan from another device</p>
          </div>
        </button>
      </div>

      {/* HELPLINE */}
      <a href={`tel:${data.adminPhone}`} className={`flex items-center justify-between p-6 border rounded-[2rem] ${darkMode ? 'border-white/5 bg-white/[0.01]' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center gap-4">
          <div className="text-emerald-500 bg-emerald-500/10 p-3 rounded-2xl"><Phone size={20}/></div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Assistance: {data.adminPhone}</span>
        </div>
        <IndianRupee size={16} className="opacity-20" />
      </a>

      {/* --- QR POPUP WITH BLUR --- */}
      {showQr && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#020617]/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className={`relative w-full max-w-sm p-10 rounded-[3rem] shadow-2xl scale-in-center ${darkMode ? 'bg-[#0a0a0c] border border-white/10' : 'bg-white'}`}>
            <button onClick={() => setShowQr(false)} className="absolute top-8 right-8 p-2 opacity-50 hover:opacity-100"><X /></button>
            <div className="text-center">
              <div className="bg-white p-6 rounded-[2.5rem] inline-block mb-8 shadow-2xl">
                <img src={data.qrCode} alt="Payment QR" className="w-52 h-52 object-contain" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Merchant UPI ID</p>
              <code className="text-xs font-bold block mb-4 opacity-70">{data.adminUpiId}</code>
              <p className="text-[8px] font-bold opacity-30 uppercase tracking-widest max-w-[200px] mx-auto">
                After payment, please notify the office for instant ledger sync.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPayment;