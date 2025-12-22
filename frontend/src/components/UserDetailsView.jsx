import React, { useState, useEffect } from 'react';
import { Trash2, Car, Newspaper, BellRing, RefreshCw, Search, ShieldCheck, User, Hash, Download, Eye, X, FileText, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const UserDetailsView = () => {
  const [activeSubTab, setActiveSubTab] = useState('vehicles');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [imagePreview, setImagePreview] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    let endpoint = activeSubTab === 'vehicles' ? '/api/vehicle-details/list' 
                 : activeSubTab === 'licenses' ? '/api/license-details/list' 
                 : '/api/reminders/list';
    try {
      const res = await fetch(`https://drivingschool-9b6b.onrender.com${endpoint}`);
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) { toast.error("Database Sync Failed"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [activeSubTab]);

  const generatePDF = (item) => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("OFFICIAL REGISTRY REPORT", 14, 25);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Record ID: ${item._id}`, 14, 50);
      doc.text(`Type: ${activeSubTab.toUpperCase()}`, 14, 55);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 60);

      const rows = Object.entries(item)
        .filter(([key]) => !['_id', '__v', 'documentPath', 'createdAt', 'updatedAt'].includes(key))
        .map(([key, val]) => [
          key.replace(/([A-Z])/g, ' $1').toUpperCase(),
          val !== null && val !== undefined && val !== '' ? String(val) : 'N/A'
        ]);

      autoTable(doc, {
        startY: 70,
        head: [['Field Name', 'System Value']],
        body: rows,
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 247, 250] },
      });

      doc.save(`${activeSubTab}_${item.fullName || item.ownerName || 'report'}.pdf`);
      toast.success("PDF DOWNLOADED");
    } catch (err) {
      toast.error("PDF GENERATION FAILED");
    }
  };

  const downloadImage = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "document_image.jpg");
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloading...");
  };

  const filteredData = data.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 w-full overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Container with responsive max-width and padding */}
      <div className="w-full px-0 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-500 w-7 h-7 shrink-0" />
            <h1 className="text-lg sm:text-2xl font-black italic text-white uppercase tracking-tighter">DATA MASTER</h1>
          </div>
          <button onClick={fetchData} className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all shrink-0">
            <RefreshCw size={18} className={loading ? 'animate-spin text-blue-500' : 'text-slate-400'}/>
          </button>
        </div>

        {/* Search Bar - Full Width */}
        <div className="relative w-full mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="SEARCH RECORDS..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-[11px] font-bold uppercase text-white outline-none focus:border-blue-500/40 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Navigation Tabs - Horizontal Scroll on small screens */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-2 -mx-2 px-4 sm:mx-0 sm:px-0 ">
          <TabBtn  active={activeSubTab === 'vehicles'} onClick={() => setActiveSubTab('vehicles')} icon={<Car size={14}/>} label="Vehicles" />
          <TabBtn active={activeSubTab === 'licenses'} onClick={() => setActiveSubTab('licenses')} icon={<Newspaper size={14}/>} label="Licenses" />
          <TabBtn active={activeSubTab === 'reminders'} onClick={() => setActiveSubTab('reminders')} icon={<BellRing size={14}/>} label="Alerts" />
        </div>

        {/* Responsive Grid System: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredData.map((item) => (
              <motion.div 
                layout 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                key={item._id}
                className="bg-white/[0.03] border border-white/10 rounded-[1.5rem] p-4 sm:p-5 relative group w-full box-border"
              >
                {/* Action Toolbar */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <button onClick={() => generatePDF(item)} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><FileText size={16}/></button>
                    {item.documentPath && (
                      <button onClick={() => setImagePreview(item.documentPath)} className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"><Eye size={16}/></button>
                    )}
                  </div>
                  <button onClick={() => setDeleteModal({show: true, id: item._id})} className="p-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                </div>

                {/* Content Logic */}
                <div className="space-y-3">
                  {activeSubTab === 'vehicles' && (
                    <>
                      <DataField label="Plate" value={item.registrationNumber} highlight icon={<Hash size={10}/>} />
                      <DataField label="Owner" value={item.ownerName} icon={<User size={10}/>} />
                      <DataField label="Mobile" value={item.primaryMobile} icon={<Phone size={10}/>} />
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
                        <StatusBadge label="Reg" date={item.regValidity} />
                        <StatusBadge label="Ins" date={item.insuranceValidity} />
                        <StatusBadge label="Pol" date={item.pollutionValidity} />
                        <StatusBadge label="Pmt" date={item.permitValidity} />
                      </div>
                    </>
                  )}

                  {activeSubTab === 'licenses' && (
                    <>
                      <DataField label="Lic No" value={item.licenseNumber} highlight icon={<Hash size={10}/>} />
                      <DataField label="Name" value={item.fullName} icon={<User size={10}/>} />
                      <DataField label="Mobile" value={item.primaryMobile} icon={<Phone size={10}/>} />
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
                        <StatusBadge label="LMV" date={item.lmvValidity} />
                        <StatusBadge label="2W" date={item.twoWheelerValidity} />
                        <StatusBadge label="ERK" date={item.erikshaValidity} />
                        <StatusBadge label="HMV" date={item.hmvValidity} />
                      </div>
                    </>
                  )}

                  {activeSubTab === 'reminders' && (
                    <>
                      <DataField label="Name" value={item.fullName} highlight icon={<User size={10}/>} />
                      <DataField label="Mail" value={item.email} icon={<Mail size={10}/>} />
                      <DataField label="Licence" value={item.registrationNumber} icon={<Hash size={10}/>} />
                      <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between ${item.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                        <span className="text-[9px] font-black uppercase tracking-tighter">Status: {item.status || 'Inactive'}</span>
                        <BellRing size={14} className={item.status === 'active' ? 'animate-bounce' : ''} />
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-slate-600 uppercase">
                  <span>REF: {item._id?.slice(-6)}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal - Responsive width */}
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0f172a] border border-white/10 p-6 rounded-[2rem] w-full max-w-xs text-center shadow-2xl">
              <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={20}/></div>
              <h3 className="text-lg font-black text-white uppercase italic mb-1">Confirm?</h3>
              <p className="text-slate-500 text-[9px] font-bold mb-6 uppercase tracking-wider">Operation is irreversible.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteModal({show:false, id:null})} className="flex-1 py-3.5 bg-white/5 text-white rounded-xl font-black uppercase text-[10px] border border-white/10 active:scale-95">No</button>
                <button onClick={async () => {
                   const endpoint = activeSubTab === 'vehicles' ? 'vehicle-details' : activeSubTab === 'licenses' ? 'license-details' : 'reminders';
                   const res = await fetch(`https://drivingschool-9b6b.onrender.com/api/${endpoint}/${deleteModal.id}`, { method: 'DELETE' });
                   const result = await res.json();
                   if (result.success) {
                     toast.success("REMOVED");
                     setDeleteModal({show:false, id:null});
                     fetchData();
                   }
                }} className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] active:scale-95">Purge</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Screen Image Preview */}
      <AnimatePresence>
        {imagePreview && (
          <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col p-4 backdrop-blur-md">
            <button onClick={() => setImagePreview(null)} className="absolute top-4 right-4 text-white hover:text-blue-500 transition-colors"><X size={32}/></button>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <img src={imagePreview} className="max-w-full max-h-full object-contain rounded-lg" alt="Document" />
            </div>
            <div className="mt-4 flex flex-col gap-2 max-w-md mx-auto w-full">
              <button onClick={() => downloadImage(imagePreview)} className="py-3.5 bg-blue-600 text-white rounded-xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2"><Download size={16}/> Save Image</button>
              <button onClick={() => setImagePreview(null)} className="py-3.5 bg-white/5 text-white rounded-xl font-black uppercase text-[11px] border border-white/10">Close</button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- Helper Components (Logic Unchanged) --- */

const DataField = ({ label, value, icon, highlight }) => (
  <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl overflow-hidden">
    <div className="flex items-center gap-1.5 mb-0.5 opacity-40">
      {icon}
      <p className="text-[7px] font-black uppercase tracking-widest">{label}</p>
    </div>
    <p className={`text-[11px] font-bold uppercase truncate ${highlight ? 'text-blue-400 italic font-black' : 'text-slate-200'}`}>
      {value || 'EMPTY'}
    </p>
  </div>
);

const StatusBadge = ({ label, date }) => {
  if (!date || date === "null") return null;
  const isExpired = new Date(date) < new Date();
  return (
    <div className={`p-2 rounded-lg border flex flex-col text-[10px] font-black uppercase transition-colors ${isExpired ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
      <span className="opacity-40 text-[10px]">{label}</span>
      <span className="truncate">{new Date(date).toLocaleDateString()}</span>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-4 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 ${
      active 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
      : 'bg-white/5 text-slate-500 border border-white/10'
    }`}
  >
    {icon} <span>{label}</span>
  </button>
);

export default UserDetailsView;