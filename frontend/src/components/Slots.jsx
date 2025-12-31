import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutGrid, Plus, Trash2, CheckCircle2, X, 
  Calendar as CalIcon, Clock, ArrowRight, 
  ShieldAlert, AlertCircle, Edit3, Bike, Car, Truck, Users
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'https://drivingschool-9b6b.onrender.com/api/slots';

const Slots = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); 
  const [editingId, setEditingId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('four-wheeler');

  // Updated state to include capacity (defaulting to 20)
  const [categorySettings, setCategorySettings] = useState({
    'two-wheeler': { road: { active: false, start: '', end: '', capacity: 20 }, ground: { active: false, start: '', end: '', capacity: 20 } },
    'four-wheeler': { road: { active: false, start: '', end: '', capacity: 20 }, ground: { active: false, start: '', end: '', capacity: 20 }, simulation: { active: false, start: '', end: '', capacity: 20 } },
    'heavy': { road: { active: false, start: '', end: '', capacity: 20 }, ground: { active: false, start: '', end: '', capacity: 20 }, simulation: { active: false, start: '', end: '', capacity: 20 } }
  });

  const [globalDate, setGlobalDate] = useState('');
  const [isClosed, setIsClosed] = useState(false);

  const formatTime12h = (time) => {
    if (!time) return '--:--';
    const [h, m] = time.split(':');
    const hh = parseInt(h);
    const suffix = hh >= 12 ? 'PM' : 'AM';
    const hour12 = hh % 12 || 12;
    return `${hour12}:${m} ${suffix}`;
  };

  useEffect(() => { fetchSlots(); }, []);

  const fetchSlots = async () => {
    try {
      const res = await axios.get(API_URL);
      setSlots(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("SYSTEM OFFLINE");
      setLoading(false);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!globalDate) return toast.error("DATE REQUIRED");

    const payload = {
      date: globalDate,
      category: isClosed ? 'ALL' : activeCategory,
      isClosed: isClosed,
      modules: isClosed ? {} : categorySettings[activeCategory],
    };

    try {
      const res = await axios.post(`${API_URL}/configure`, payload);
      if (res.data.success) {
        toast.success(editingId ? "CONFIGURATION UPDATED" : "SESSION DEPLOYED");
        fetchSlots();
        closeModal();
      }
    } catch (err) { toast.error("DEPLOYMENT FAILED"); }
  };

  const handleEdit = (slot) => {
    setEditingId(slot._id);
    setGlobalDate(slot.date);
    setIsClosed(slot.isClosed);
    if (!slot.isClosed) {
      setActiveCategory(slot.category);
      setCategorySettings(prev => ({ ...prev, [slot.category]: slot.modules }));
    }
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${showDeleteConfirm}`);
      setSlots(slots.filter(s => s._id !== showDeleteConfirm));
      toast.success("SESSION TERMINATED");
      setShowDeleteConfirm(null);
    } catch (err) { toast.error("DELETE FAILED"); }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setGlobalDate('');
    setIsClosed(false);
  };

  const updateModuleField = (module, field, value) => {
    setCategorySettings(prev => ({
      ...prev, [activeCategory]: {
        ...prev[activeCategory], [module]: { ...prev[activeCategory][module], [field]: value }
      }
    }));
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto animate-in fade-in duration-700 font-sans tracking-tight bg-[#020617] min-h-screen text-slate-200">
      
      {/* --- DELETE POPUP --- */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)} />
          <div className="bg-[#0f172a] border border-red-500/20 p-8 rounded-[2rem] max-w-sm w-full z-10 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-black uppercase italic text-white">Terminate Session?</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium uppercase tracking-tighter">This action will permanently purge this slot configuration from the grid.</p>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-4 rounded-xl bg-slate-800 font-black uppercase text-[10px] tracking-widest text-slate-400">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 rounded-xl bg-red-600 font-black uppercase text-[10px] tracking-widest text-white shadow-lg shadow-red-500/20">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN MODAL (CREATE/EDIT) --- */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={closeModal} />
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase">{editingId ? 'Edit Configuration' : 'Slot Configuration'}</h2>
                <p className="text-[8px] md:text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mt-1">Operational Protocol v2.5</p>
              </div>
              <button onClick={closeModal} className="p-2 md:p-3 hover:bg-white/5 rounded-full text-slate-400 transition-all"><X size={24} /></button>
            </div>

            <form onSubmit={handleCreateSlot} className="p-6 md:p-10 space-y-6 md:space-y-8 overflow-y-auto">
              <div className="space-y-3">
                <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <CalIcon size={14} className="text-blue-500" /> 1. Select Operation Date
                </label>
                <input 
                  type="date" 
                  disabled={!!editingId} 
                  className={`w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 text-lg font-black text-white outline-none transition-all ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  value={globalDate}
                  onChange={(e) => setGlobalDate(e.target.value)}
                />
              </div>

              <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-500 flex items-center justify-between ${isClosed ? 'bg-red-500/10 border-red-500/40' : 'bg-white/[0.03] border-white/5'}`}>
                <div className="flex items-center gap-3">
                   <div className={`p-2 md:p-3 rounded-xl ${isClosed ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <ShieldAlert size={20} />
                   </div>
                   <p className={`text-[10px] md:text-xs font-black uppercase ${isClosed ? 'text-red-500' : 'text-white'}`}>Today Closed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={isClosed} onChange={(e) => setIsClosed(e.target.checked)} />
                  <div className="w-12 h-6 md:w-14 md:h-7 bg-slate-800 rounded-full peer peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:after:translate-x-full shadow-inner"></div>
                </label>
              </div>

              {!isClosed && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-3 p-1.5 bg-black/40 rounded-xl border border-white/5 gap-1">
                    {Object.keys(categorySettings).map(cat => (
                      <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={`py-3 rounded-lg text-[9px] font-black uppercase transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{cat.replace('-', ' ')}</button>
                    ))}
                  </div>

                  <div className="grid gap-3">
                    {Object.keys(categorySettings[activeCategory]).map(mod => {
                       const modActive = categorySettings[activeCategory][mod].active;
                       return (
                        <div key={mod} className={`rounded-2xl border p-4 transition-all ${modActive ? 'bg-blue-600/5 border-blue-500/30' : 'bg-black/20 border-white/5'}`}>
                          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-4 cursor-pointer">
                                <input type="checkbox" className="hidden" checked={modActive} onChange={() => setCategorySettings(prev => ({...prev, [activeCategory]: {...prev[activeCategory], [mod]: {...prev[activeCategory][mod], active: !modActive}}}))} />
                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${modActive ? 'bg-blue-500 border-blue-500' : 'border-white/10'}`}>
                                  {modActive && <CheckCircle2 size={12} className="text-white" />}
                                </div>
                                <span className={`text-xs font-black uppercase italic ${modActive ? 'text-white' : 'text-slate-500'}`}>{mod}</span>
                              </label>
                              
                              {/* --- CAPACITY INPUT --- */}
                              {modActive && (
                                <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-xl border border-white/5 ml-2">
                                  <Users size={12} className="text-blue-500" />
                                  <input 
                                    type="number" 
                                    className="bg-transparent w-10 text-[10px] font-black text-white outline-none" 
                                    value={categorySettings[activeCategory][mod].capacity} 
                                    onChange={(e) => updateModuleField(mod, 'capacity', e.target.value)}
                                    placeholder="Cap"
                                  />
                                </div>
                              )}
                            </div>

                            {modActive && (
                              <div className="flex items-center gap-2">
                                <input type="time" className="bg-black border border-white/10 rounded-lg px-3 py-2 text-[10px] font-black text-white" value={categorySettings[activeCategory][mod].start} onChange={(e) => updateModuleField(mod, 'start', e.target.value)} />
                                <ArrowRight size={14} className="text-slate-700" />
                                <input type="time" className="bg-black border border-white/10 rounded-lg px-3 py-2 text-[10px] font-black text-white" value={categorySettings[activeCategory][mod].end} onChange={(e) => updateModuleField(mod, 'end', e.target.value)} />
                              </div>
                            )}
                          </div>
                        </div>
                       )
                    })}
                  </div>
                </div>
              )}

              <button type="submit" className={`w-full py-5 rounded-2xl font-black text-sm uppercase italic tracking-[0.2em] shadow-2xl ${isClosed ? 'bg-red-600 text-white' : 'bg-white text-black'}`}>
                {isClosed ? 'Confirm Shutdown' : editingId ? 'Update Operational Slot' : 'Deploy Operational Slot'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl"><LayoutGrid size={30} className="text-white" /></div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Slot Grid</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Management Console</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="w-full md:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl"><Plus size={18} className="inline mr-2" /> New Session</button>
      </div>

      {/* --- DATA GRID --- */}
      <div className="bg-[#0f172a] border border-white/5 rounded-[2rem] md:rounded-[4rem] shadow-2xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-[400px] text-white font-black animate-pulse">SYNCING WITH SERVER...</div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] opacity-20 text-center px-6">
            <CalIcon size={100} strokeWidth={1} />
            <p className="text-sm font-black uppercase italic tracking-[0.4em] mt-4">No Active Sessions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="hidden lg:table w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-10 py-8 text-left text-[11px] font-black text-slate-500 uppercase italic">Date & Category</th>
                  <th className="px-10 py-8 text-left text-[11px] font-black text-slate-500 uppercase italic">Modules (12H)</th>
                  <th className="px-10 py-8 text-left text-[11px] font-black text-slate-500 uppercase italic">Status</th>
                  <th className="px-10 py-8 text-right text-[11px] font-black text-slate-500 uppercase italic">Command</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {slots.map((slot) => (
                  <tr key={slot._id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-10 py-10">
                        <div className="font-black text-white italic text-2xl">{slot.date}</div>
                        <div className="flex items-center gap-2 mt-1 text-blue-500">
                           {slot.category === 'two-wheeler' ? <Bike size={14} /> : slot.category === 'four-wheeler' ? <Car size={14} /> : <Truck size={14} />}
                           <span className="text-[10px] font-black uppercase tracking-widest">{slot.category}</span>
                        </div>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex flex-wrap gap-3">
                        {slot.isClosed ? <span className="text-slate-600 text-[10px] font-black uppercase">RESTRICTED</span> : 
                          Object.entries(slot.modules).map(([name, data]) => data.active && (
                            <div key={name} className="bg-black/40 border border-white/5 px-4 py-3 rounded-2xl">
                              <div className="flex justify-between items-center mb-1 gap-4">
                                <span className="text-slate-500 block text-[8px] font-black uppercase">{name}</span>
                                <span className="text-blue-400 text-[8px] font-black uppercase flex items-center gap-1">
                                  <Users size={8} /> {data.capacity || 20}
                                </span>
                              </div>
                              <div className="text-emerald-400 text-[10px] font-black">
                                {formatTime12h(data.start)} - {formatTime12h(data.end)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border ${slot.isClosed ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'}`}>
                        {slot.isClosed ? 'CLOSED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-10 py-10 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(slot)} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><Edit3 size={18} /></button>
                        <button onClick={() => setShowDeleteConfirm(slot._id)} className="p-3 bg-red-500/5 rounded-xl text-slate-600 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Mobile Cards */}
            <div className="lg:hidden p-4 space-y-4">
               {slots.map(slot => (
                 <div key={slot._id} className="bg-white/5 border border-white/5 rounded-[2rem] p-6">
                    <div className="flex justify-between">
                       <div className="text-xl font-black italic">{slot.date}</div>
                       <div className="flex gap-2">
                         <button onClick={() => handleEdit(slot)} className="p-2 text-slate-400"><Edit3 size={18}/></button>
                         <button onClick={() => setShowDeleteConfirm(slot._id)} className="p-2 text-red-900"><Trash2 size={18}/></button>
                       </div>
                    </div>
                    <div className="text-blue-500 text-[9px] font-black uppercase mt-1 mb-4">{slot.category}</div>
                    <div className="flex flex-wrap gap-2">
                       {slot.isClosed ? <span className="text-red-500 text-[9px] font-black uppercase">RESTRICTED</span> : 
                         Object.entries(slot.modules).map(([name, data]) => data.active && (
                           <div key={name} className="bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                              <div className="text-[7px] text-slate-500 font-black uppercase mb-1">{name} | Cap: {data.capacity || 20}</div>
                              <div className="text-emerald-400 text-[9px] font-black uppercase italic">{formatTime12h(data.start)} - {formatTime12h(data.end)}</div>
                           </div>
                         ))
                       }
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slots;