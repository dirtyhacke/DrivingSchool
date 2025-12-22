import React, { useState, useEffect } from 'react';
import { 
  Search, Trash2, Loader2, User as UserIcon, 
  MapPin, Calendar, ShieldAlert, AlertTriangle,
  ExternalLink, Copy, Check, Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

const UsersRegistry = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: "" });

  useEffect(() => {
    fetchMasterRegistry();
  }, []);

  const fetchMasterRegistry = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/management/master-registry');
      const data = await res.json();
      if (data.success) setStudents(data.users);
    } catch (err) {
      toast.error("Database connection failed");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    const id = deleteModal.userId;
    try {
      const res = await fetch(`http://localhost:8080/api/admin/management/terminate/${id}`, { 
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
    <div className="w-full bg-slate-950/20 relative min-h-[500px] pb-32 lg:pb-0">
      
      {/* --- DELETE MODAL (Remains Centered) --- */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setDeleteModal({show:false})}></div>
          <div className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-sm relative z-[1010] animate-in zoom-in duration-300 shadow-2xl mx-4">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-slate-950 font-black uppercase italic text-xl text-center tracking-tighter">Confirm Purge</h3>
            <p className="text-slate-500 text-[10px] mt-3 font-medium text-center leading-relaxed italic">
              Removing <span className="font-bold text-slate-900">{deleteModal.userName}</span> is permanent.
            </p>
            <div className="flex flex-col gap-3 mt-8">
              <button onClick={confirmDelete} className="w-full py-4 rounded-xl bg-red-600 text-white font-black uppercase text-[10px]">Execute Purge</button>
              <button onClick={() => setDeleteModal({show:false})} className="w-full py-4 rounded-xl bg-slate-100 text-slate-500 font-black uppercase text-[10px]">Abort</button>
            </div>
          </div>
        </div>
      )}

      {/* --- REGISTRY HEADER --- */}
      <div className="p-6 md:p-10 border-b border-white/10 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Master Registry</h2>
          <div className="flex items-center justify-center lg:justify-start gap-3 mt-2">
            <span className="hidden md:block h-[2px] w-8 bg-blue-600"></span>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
               <ShieldAlert size={12} className="text-blue-600"/> Security Level 01
            </p>
          </div>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
          <input 
            type="text" 
            placeholder="Search Identity..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- DESKTOP TABLE (HIDDEN ON MOBILE) --- */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] bg-white/[0.02]">
              <th className="px-10 py-6">Identity Node</th>
              <th className="px-10 py-6">Contact</th>
              <th className="px-10 py-6">Location</th>
              <th className="px-10 py-6">Date</th>
              <th className="px-10 py-6 text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {!loading && filteredStudents.map((student) => (
               <DesktopRow key={student._id} student={student} copyToClipboard={copyToClipboard} setDeleteModal={setDeleteModal} />
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD VIEW (HIDDEN ON DESKTOP) --- */}
      <div className="lg:hidden p-4 space-y-4">
        {loading ? (
            <div className="py-20 text-center">
                <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Scanning Nodes...</span>
            </div>
        ) : filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
                <MobileCard key={student._id} student={student} setDeleteModal={setDeleteModal} />
            ))
        ) : (
            <div className="py-20 text-center text-slate-700 uppercase text-[8px] font-black tracking-widest">No Identities Found</div>
        )}
      </div>

      {/* --- FOOTER --- */}
      <div className="p-6 md:p-8 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-slate-600 uppercase tracking-widest">
        <div>Nodes: <span className="text-blue-600">{filteredStudents.length}</span></div>
        <div className="italic">Protocol Active</div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS FOR CLEANER CODE --- */

const DesktopRow = ({ student, copyToClipboard, setDeleteModal }) => (
    <tr className="hover:bg-blue-600/[0.02] transition-all group">
      <td className="px-10 py-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
            {student.profileImage ? <img src={student.profileImage} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700"><UserIcon size={16} /></div>}
          </div>
          <div>
            <div className="font-bold text-sm text-white uppercase tracking-tight">{student.fullName}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-500 lowercase">{student.email}</span>
              <button onClick={() => copyToClipboard(student.email)} className="text-slate-700 hover:text-white"><Copy size={10} /></button>
            </div>
          </div>
        </div>
      </td>
      <td className="px-10 py-6">
        <a href={`https://wa.me/${student.phoneNumber}`} target="_blank" className="text-[10px] text-white font-black tracking-widest hover:text-emerald-500 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          {student.phoneNumber}
        </a>
      </td>
      <td className="px-10 py-6 text-[10px] font-black text-blue-500 uppercase"><MapPin size={12} className="inline mr-2 text-slate-600" />{student.location}</td>
      <td className="px-10 py-6 text-[10px] text-slate-500 font-bold">{new Date(student.createdAt).toLocaleDateString()}</td>
      <td className="px-10 py-6 text-right">
        <button onClick={() => setDeleteModal({ show: true, userId: student._id, userName: student.fullName })} className="p-2 text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"><Trash2 size={16} /></button>
      </td>
    </tr>
);

const MobileCard = ({ student, setDeleteModal }) => (
    <div className="bg-white/[0.03] border border-white/5 p-5 rounded-3xl relative overflow-hidden group">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden">
                {student.profileImage ? <img src={student.profileImage} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-slate-800 flex items-center justify-center"><UserIcon size={18} /></div>}
            </div>
            <div className="flex-1">
                <h4 className="text-white font-black uppercase text-xs tracking-tight italic">{student.fullName}</h4>
                <p className="text-[9px] text-slate-500 lowercase mt-0.5">{student.email}</p>
            </div>
            <button onClick={() => setDeleteModal({ show: true, userId: student._id, userName: student.fullName })} className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                <Trash2 size={16} />
            </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 p-3 rounded-2xl">
                <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Deployment</p>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 uppercase italic">
                    <MapPin size={10} /> {student.location}
                </div>
            </div>
            <a href={`https://wa.me/${student.phoneNumber}`} className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/10 flex flex-col justify-center">
                <p className="text-[7px] font-black text-emerald-500 uppercase tracking-widest mb-1">WhatsApp</p>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-white">
                    <Smartphone size={10} /> {student.phoneNumber}
                </div>
            </a>
        </div>
    </div>
);

export default UsersRegistry;