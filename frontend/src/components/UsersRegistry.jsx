import React, { useState, useEffect } from 'react';
import { 
  Search, Trash2, Loader2, User as UserIcon, 
  MapPin, Calendar, ShieldAlert, AlertTriangle,
  ExternalLink, Copy, Check, Smartphone, Clock,
  RefreshCw, X, Info, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const UsersRegistry = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: "" });
  
  const [viewUser, setViewUser] = useState(null);
  const [expandedImg, setExpandedImg] = useState(null);

  useEffect(() => {
    fetchMasterRegistry();
  }, []);

  const fetchMasterRegistry = async () => {
    setIsRefreshing(true);
    setLoading(true);
    const refreshAudio = new Audio('./assets/audio/refresh.mp3');
    
    const audioPromise = new Promise((resolve) => {
      refreshAudio.onended = resolve;
      refreshAudio.onerror = () => resolve();
    });

    try {
      const fetchPromise = fetch('https://drivingschool-9b6b.onrender.com/api/admin/management/master-registry');
      refreshAudio.play().catch(err => console.warn("Audio blocked", err));

      const [res] = await Promise.all([fetchPromise, audioPromise]);
      const data = await res.json();
      if (data.success) setStudents(data.users);
    } catch (err) {
      toast.error("Database connection failed");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const confirmDelete = async () => {
    const id = deleteModal.userId;
    try {
      const res = await fetch(`https://drivingschool-9b6b.onrender.com/api/admin/management/terminate/${id}`, { 
        method: 'DELETE' 
      });
      const data = await res.json();
      if (data.success) {
        setStudents(students.filter(s => s._id !== id));
        toast.success(`${deleteModal.userName} purged successfully`);
      }
    } catch (err) {
      toast.error("Critical failure during purge");
    } finally {
      setDeleteModal({ show: false, userId: null, userName: "" });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Email Copied", { icon: '📋', style: { background: '#0f172a', color: '#fff' }});
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // MAIN CONTAINER: uses h-[calc(100vh-theme(spacing.16))] to fit screen or a fixed height
    <div className="flex flex-col h-screen max-h-screen w-full bg-[#05080a] text-slate-200 font-sans overflow-hidden">
      
      {/* --- STICKY HEADER SECTION --- */}
      <div className="flex-none p-6 md:p-8 border-b border-white/5 bg-slate-950/50 backdrop-blur-md z-40">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 max-w-[1600px] mx-auto w-full">
          <div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-1 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Master Registry</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
                   <ShieldAlert size={12} className="text-blue-600"/> Security Level 01 <span className="text-slate-800">|</span> <span className="text-blue-400">{filteredStudents.length} Nodes Active</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search Identity..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
                onClick={fetchMasterRegistry}
                className={`p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${isRefreshing ? 'animate-spin text-blue-500' : 'text-slate-400'}`}
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-[1600px] mx-auto w-full">
            {/* Desktop View */}
            <div className="hidden lg:block">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="sticky top-0 bg-[#05080a] z-30">
                        <tr className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                            <th className="px-8 py-5 border-b border-white/5">Identity Node</th>
                            <th className="px-8 py-5 border-b border-white/5">Contact</th>
                            <th className="px-8 py-5 border-b border-white/5">Location</th>
                            <th className="px-8 py-5 border-b border-white/5">Timestamp</th>
                            <th className="px-8 py-5 border-b border-white/5 text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                            <td colSpan="5" className="py-32 text-center">
                                <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Decrypting Data...</span>
                            </td>
                            </tr>
                        ) : filteredStudents.map((student) => (
                            <DesktopRow 
                                key={student._id} 
                                student={student} 
                                copyToClipboard={copyToClipboard} 
                                setDeleteModal={setDeleteModal} 
                                setViewUser={setViewUser} 
                                setExpandedImg={setExpandedImg}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden p-4 space-y-4 pb-32">
                {loading ? (
                    <div className="py-32 text-center">
                        <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Scanning...</span>
                    </div>
                ) : filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                        <MobileCard 
                            key={student._id} 
                            student={student} 
                            setDeleteModal={setDeleteModal} 
                            setViewUser={setViewUser}
                            setExpandedImg={setExpandedImg}
                        />
                    ))
                ) : (
                    <div className="py-20 text-center text-slate-700 uppercase text-[10px] font-black tracking-widest italic">Zero matches found in database</div>
                )}
            </div>
        </div>
      </div>

      {/* --- FOOTER STATUS BAR --- */}
      <div className="flex-none bg-slate-950 border-t border-white/5 px-6 py-3 flex justify-between items-center z-40">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">System Live</span>
            </div>
            <span className="text-slate-800 font-black">/</span>
            <span className="text-[9px] font-black text-blue-600 uppercase">Buffer: Stable</span>
        </div>
        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic flex items-center gap-2">
            Protocol Version 4.0.2 <div className="w-1 h-1 bg-slate-800 rounded-full"></div> 2024
        </div>
      </div>

      {/* --- MODALS & OVERLAYS (Keep Original Logics) --- */}
      <AnimatePresence>
        {expandedImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/98 backdrop-blur-2xl p-4"
            onClick={() => setExpandedImg(null)}
          >
            <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-all"><X size={40} strokeWidth={1} /></button>
            <motion.img 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                src={expandedImg} className="max-w-full max-h-[85vh] rounded-[2rem] shadow-2xl border border-white/10 object-contain" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewUser && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setViewUser(null)}></motion.div>
             <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-md relative z-[1010] shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-slate-900 to-blue-900"></div>
                <button onClick={() => setViewUser(null)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X size={24}/></button>
                <div className="relative mt-4 flex flex-col items-center">
                    <div onClick={() => viewUser.profileImage && setExpandedImg(viewUser.profileImage)} className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-xl cursor-zoom-in">
                        {viewUser.profileImage ? <img src={viewUser.profileImage} className="w-full h-full object-cover" /> : <User size={40} className="m-auto mt-6 text-slate-300"/>}
                    </div>
                    <h3 className="mt-4 text-2xl font-black uppercase italic tracking-tighter text-slate-950">{viewUser.fullName}</h3>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-4 py-1 rounded-full mt-2">Verified Node</span>
                </div>
                <div className="mt-8 space-y-3">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Endpoint</p>
                        <div className="flex items-center gap-3 text-slate-900 font-bold text-sm lowercase">{viewUser.email}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Region</p>
                            <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase italic"><MapPin size={12} className="text-blue-600" /> {viewUser.location}</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Comms</p>
                            <div className="flex items-center gap-2 text-slate-900 font-black text-xs italic"><Smartphone size={12} className="text-emerald-500" /> {viewUser.phoneNumber}</div>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-2xl text-white">
                         <div className="flex justify-between items-center text-[10px]">
                            <span className="font-medium text-slate-400 uppercase tracking-widest">Initialization Date</span>
                            <span className="font-black italic">{new Date(viewUser.createdAt).toLocaleDateString()}</span>
                         </div>
                    </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {deleteModal.show && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" onClick={() => setDeleteModal({show:false})}></div>
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm relative z-[1010] shadow-2xl">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 animate-pulse">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-slate-950 font-black uppercase italic text-2xl text-center tracking-tighter">Authorize Purge?</h3>
            <p className="text-slate-500 text-[11px] mt-4 font-medium text-center leading-relaxed">
              Permanent removal of <span className="font-bold text-slate-900 underline">{deleteModal.userName}</span> from master registry. This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3 mt-8">
              <button onClick={confirmDelete} className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95">Confirm Execution</button>
              <button onClick={() => setDeleteModal({show:false})} className="w-full py-4 rounded-2xl bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">Abort Protocol</button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for custom scrollbar within the component */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2563eb; }
      `}</style>
    </div>
  );
};

const DesktopRow = ({ student, copyToClipboard, setDeleteModal, setViewUser, setExpandedImg }) => {
    const dateObj = new Date(student.createdAt);
    return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => student.profileImage && setExpandedImg(student.profileImage)}
            className="w-12 h-12 rounded-2xl overflow-hidden border border-white/5 bg-slate-900 cursor-zoom-in active:scale-90 transition-all shadow-lg"
          >
            {student.profileImage ? <img src={student.profileImage} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-slate-700"><UserIcon size={20} /></div>}
          </div>
          <div>
            <div onClick={() => setViewUser(student)} className="font-black text-sm text-white uppercase italic tracking-tight cursor-pointer hover:text-blue-500 transition-all">{student.fullName}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-500 lowercase font-medium">{student.email}</span>
              <button onClick={() => copyToClipboard(student.email)} className="text-slate-700 hover:text-blue-400 transition-colors"><Copy size={12} /></button>
            </div>
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <a href={`https://wa.me/${student.phoneNumber}`} target="_blank" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-500 font-black tracking-widest hover:bg-emerald-500/10 transition-all">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          {student.phoneNumber}
        </a>
      </td>
      <td className="px-8 py-5">
        <div className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2 tracking-widest">
            <MapPin size={12} className="text-slate-600" />
            {student.location}
        </div>
      </td>
      <td className="px-8 py-5">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{dateObj.toLocaleDateString()}</div>
          <div className="text-[9px] text-blue-600 font-black flex items-center gap-1 mt-1 uppercase italic">
            <Clock size={10} /> {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
      </td>
      <td className="px-8 py-5 text-right">
        <div className="flex justify-end gap-1">
            <button onClick={() => setViewUser(student)} className="p-2.5 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"><Info size={18} /></button>
            <button onClick={() => setDeleteModal({ show: true, userId: student._id, userName: student.fullName })} className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18} /></button>
        </div>
      </td>
    </tr>
    );
};

const MobileCard = ({ student, setDeleteModal, setViewUser, setExpandedImg }) => {
    const dateObj = new Date(student.createdAt);
    return (
    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-[2rem] relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-5">
            <div 
                onClick={() => student.profileImage && setExpandedImg(student.profileImage)}
                className="w-14 h-14 rounded-2xl border border-white/10 overflow-hidden cursor-zoom-in shadow-xl"
            >
                {student.profileImage ? <img src={student.profileImage} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700"><UserIcon size={24} /></div>}
            </div>
            <div className="flex-1" onClick={() => setViewUser(student)}>
                <h4 className="text-white font-black uppercase text-sm tracking-tight italic">{student.fullName}</h4>
                <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">{dateObj.toLocaleDateString()}</span>
                    <span className="text-[9px] text-blue-600 font-black uppercase flex items-center gap-1 italic">
                        <Clock size={10} /> {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Region</p>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-500 uppercase italic truncate">
                    <MapPin size={10} /> {student.location}
                </div>
            </div>
            <a href={`https://wa.me/${student.phoneNumber}`} className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 flex flex-col">
                <p className="text-[7px] font-black text-emerald-500/60 uppercase tracking-[0.2em] mb-1">WhatsApp</p>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-white">
                    <Smartphone size={10} className="text-emerald-500"/> {student.phoneNumber}
                </div>
            </a>
        </div>

        <div className="flex gap-2">
            <button onClick={() => setViewUser(student)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
                <Info size={14} /> Full Intel
            </button>
            <button onClick={() => setDeleteModal({ show: true, userId: student._id, userName: student.fullName })} className="p-3 bg-red-500/10 text-red-500 rounded-xl active:scale-90 border border-red-500/20">
                <Trash2 size={16} />
            </button>
        </div>
    </div>
    );
};

export default UsersRegistry;