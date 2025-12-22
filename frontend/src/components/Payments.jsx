import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Search, Upload, CheckCircle2, 
  Loader2, TrendingUp, Clock, Calendar, 
  User as UserIcon, Wallet 
} from 'lucide-react';

const Payments = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    userId: '',
    studentName: '',
    paidAmount: '',
    remainingAmount: '',
    upiId: '',
    phone: '',
    vehicleCategory: 'LMV', // Added category logic
    qrFile: null
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const studentRes = await fetch('https://drivingschoolbackend.vercel.app/api/payments/students');
      const sData = await studentRes.json();
      if(sData.success) setStudents(sData.users || []);

      const payRes = await fetch('https://drivingschoolbackend.vercel.app/api/payments/all');
      const pData = await payRes.json();
      if(pData.success) setPayments(pData.payments || []);
    } catch (err) { 
      console.error("Initial load error:", err); 
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.userId) return alert("Please select a student!");
    
    setLoading(true);
    const data = new FormData();

    // Logic for Status based on balance
    const status = Number(formData.remainingAmount) <= 0 ? 'completed' : 'partial';

    data.append('userId', formData.userId);
    data.append('studentName', formData.studentName);
    data.append('paidAmount', formData.paidAmount || 0);
    data.append('remainingAmount', formData.remainingAmount || 0);
    data.append('vehicleCategory', formData.vehicleCategory); // Append category
    data.append('upiId', formData.upiId);
    data.append('phone', formData.phone);
    data.append('status', status); // Append status

    if (formData.qrFile) data.append('qrImage', formData.qrFile);

    try {
      const res = await fetch('https://drivingschoolbackend.vercel.app/api/payments/update', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.success) {
        setFormData({ ...formData, qrFile: null, paidAmount: '', remainingAmount: '' });
        fetchInitialData();
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const filteredPayments = payments.filter(p => 
    p.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 p-4 md:p-8 font-sans">
      
      {/* --- HEADER STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Students', val: payments.length, icon: UserIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Pending Revenue', val: `₹${payments.reduce((acc, curr) => acc + curr.remainingAmount, 0)}`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Collection Rate', val: '84%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#16161a] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
            <div className={`${stat.bg} p-3 rounded-xl`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: MANAGEMENT FORM --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#16161a] border border-white/5 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wallet size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">Payment Sync</h2>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Select Student</label>
                <select 
                  required
                  onChange={(e) => {
                      const selected = students.find(x => x._id === e.target.value);
                      setFormData({...formData, userId: e.target.value, studentName: selected?.fullName});
                  }}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none transition-all cursor-pointer text-white"
                >
                  <option value="">Choose Student...</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.fullName}</option>)}
                </select>
              </div>

              {/* Vehicle Category Dropdown (Integrated into your UI) */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Vehicle Category</label>
                <select 
                  value={formData.vehicleCategory}
                  onChange={(e) => setFormData({...formData, vehicleCategory: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none transition-all cursor-pointer text-white"
                >
                  <option value="LMV">LMV (Car)</option>
                  <option value="MCWG">MCWG (Bike)</option>
                  <option value="Both">Both (Car + Bike)</option>
                  <option value="HMV">HMV (Heavy)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Paid (₹)</label>
                  <input type="number" value={formData.paidAmount} onChange={e => setFormData({...formData, paidAmount: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Balance (₹)</label>
                  <input type="number" value={formData.remainingAmount} onChange={e => setFormData({...formData, remainingAmount: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-sm" placeholder="0" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Admin UPI</label>
                <input type="text" value={formData.upiId} onChange={e => setFormData({...formData, upiId: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-sm" placeholder="merchant@upi" />
              </div>

              <div className="relative group border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                <input type="file" onChange={e => setFormData({...formData, qrFile: e.target.files[0]})} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Upload className="mx-auto text-slate-500 group-hover:text-blue-500 mb-2" size={20} />
                <p className="text-[10px] font-bold text-slate-400 uppercase">{formData.qrFile ? formData.qrFile.name : 'Update QR Image'}</p>
              </div>

              <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 transition-all active:scale-[0.98]">
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Update Ledger'}
              </button>
            </form>
          </div>
        </div>

        {/* --- RIGHT: THE LEDGER TABLE --- */}
        <div className="lg:col-span-8 bg-[#16161a] border border-white/5 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <h2 className="text-md font-bold text-white flex items-center gap-2">
               Active Ledger <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-0.5 rounded-full">{filteredPayments.length}</span>
             </h2>
             <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/10 focus-within:border-blue-500/50 transition-all">
                <Search size={16} className="text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Filter records..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none text-sm focus:ring-0 w-full md:w-48 outline-none" 
                />
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Category</th> {/* Category Column */}
                  <th className="px-6 py-4 text-center">Date</th>
                  <th className="px-6 py-4 text-right">Paid</th>
                  <th className="px-6 py-4 text-right">Balance</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayments.map(p => (
                  <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{p.studentName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] font-bold text-blue-400 uppercase">{p.vehicleCategory || 'LMV'}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
                        <Calendar size={12} />
                        {new Date(p.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-500">₹{p.paidAmount}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-red-400">₹{p.remainingAmount}</td>
                    <td className="px-6 py-4 text-center">
                        <span className={`text-[9px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider border ${
                          p.status === 'completed' 
                          ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' 
                          : 'bg-amber-500/5 text-amber-500 border-amber-500/20'
                        }`}>
                            {p.status}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPayments.length === 0 && (
              <div className="p-20 text-center text-slate-600">
                <Search className="mx-auto mb-4 opacity-20" size={48} />
                <p className="text-sm font-medium">No matching financial records found.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payments;