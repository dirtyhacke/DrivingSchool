import React, { useState, useMemo } from 'react';
import { X, Save, Trash2, Bike, Car, Truck, ArrowLeft, Loader2, AlertTriangle, Calendar as CalendarIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const NormalHajerBook = ({ selectedUser, currentUser, onSave, onClose, saving, setData }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    road: '', ground: '', simulation: ''
  });

  // Get current vehicle data
  const currentCourse = useMemo(() => {
    const courses = currentUser?.courses || currentUser?.progress || [];
    return courses.find(c => c.vehicleType === selectedCategory);
  }, [currentUser, selectedCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) setFormData(p => ({ ...p, [name]: value }));
  };

  const handleAction = async (actionType = 'save', sessionIndex = null) => {
    if (!selectedCategory) return toast.error("Select a vehicle type");
    
    const allCourses = currentUser?.courses || currentUser?.progress || [];
    let updatedCourses = JSON.parse(JSON.stringify(allCourses));
    let courseIndex = updatedCourses.findIndex(c => c.vehicleType === selectedCategory);

    if (courseIndex === -1) {
      updatedCourses.push({
        vehicleType: selectedCategory,
        attendance: Array(1500).fill(0),
        sessions: [], 
        gridRows: 30, gridCols: 50
      });
      courseIndex = updatedCourses.length - 1;
    }

    const course = updatedCourses[courseIndex];
    if (!course.sessions) course.sessions = [];

    if (actionType === 'delete_session') {
      course.sessions.splice(sessionIndex, 1);
    } 
    else if (actionType === 'delete_all') {
      course.attendance = Array(1500).fill(0);
      course.sessions = [];
      setShowDeleteConfirm(false);
    } 
    else if (actionType === 'save') {
      if (!formData.road && !formData.ground && !formData.simulation) return toast.error("Enter values");

      const sectionSize = Math.floor((course.gridRows || 30) / 3);
      const newAttendance = [...course.attendance];

      const fill = (startRow, count) => {
        let filled = 0;
        let target = parseInt(count) || 0;
        for (let r = startRow; r < (course.gridRows || 30) && filled < target; r++) {
          for (let c = 0; c < 50 && filled < target; c++) {
            const idx = r * 50 + c;
            if (newAttendance[idx] === 0) {
              newAttendance[idx] = 1;
              filled++;
            }
          }
        }
      };

      fill(0, formData.simulation);
      fill(sectionSize, formData.ground);
      fill(sectionSize * 2, formData.road);
      
      course.attendance = newAttendance;
      course.sessions.push({
        date: formData.date,
        road: formData.road || '0',
        ground: formData.ground || '0',
        simulation: formData.simulation || '0',
        id: `sess_${Date.now()}`
      });
    }

    try {
      await onSave(selectedUser.user._id, updatedCourses);
      if (actionType === 'save') {
        setFormData({ ...formData, road: '', ground: '', simulation: '' });
      }
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 p-8 rounded-[2rem] max-w-xs w-full text-center">
            <AlertTriangle size={32} className="text-red-500 mx-auto mb-4" />
            <p className="text-white font-black text-[10px] uppercase mb-6 tracking-widest">Wipe All Records?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 bg-white/5 text-white rounded-xl text-[10px] font-black uppercase">Cancel</button>
              <button onClick={() => handleAction('delete_all')} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase">Wipe</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-white font-black uppercase italic text-sm tracking-tight">{selectedUser.user.fullName}</h2>
          </div>
          <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5">
             <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Quick Entry</span>
          </div>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          {/* CATEGORY SELECTOR */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[ 
              { id: 'two-wheeler', icon: <Bike />, label: '2 Wheeler' },
              { id: 'four-wheeler', icon: <Car />, label: '4 Wheeler' },
              { id: 'heavy-vehicle', icon: <Truck />, label: 'Heavy' }
            ].map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`p-6 rounded-3xl border flex flex-col items-center gap-2 transition-all ${selectedCategory === cat.id ? 'bg-blue-600 border-blue-400 text-white shadow-xl scale-95' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>
                {cat.icon} <span className="text-[10px] font-black uppercase tracking-tighter">{cat.label}</span>
              </button>
            ))}
          </div>

          {selectedCategory ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              {/* INPUT FORM */}
              <div className="bg-black/40 p-6 rounded-[2rem] border border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col gap-1.5 text-center">
                    <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Date</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="bg-slate-800 text-white p-3 rounded-xl text-xs border-none" />
                  </div>
                  <div className="flex flex-col gap-1.5 text-center">
                    <label className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Road</label>
                    <input name="road" placeholder="0" value={formData.road} onChange={handleInputChange} className="bg-slate-800 text-white p-3 rounded-xl text-xs border-none font-bold" />
                  </div>
                  <div className="flex flex-col gap-1.5 text-center">
                    <label className="text-[9px] text-blue-400 font-black uppercase tracking-widest">Ground</label>
                    <input name="ground" placeholder="0" value={formData.ground} onChange={handleInputChange} className="bg-slate-800 text-white p-3 rounded-xl text-xs border-none font-bold" />
                  </div>
                  {selectedCategory !== 'two-wheeler' && (
                    <div className="flex flex-col gap-1.5 text-center">
                      <label className="text-[9px] text-purple-400 font-black uppercase tracking-widest">Sim</label>
                      <input name="simulation" placeholder="0" value={formData.simulation} onChange={handleInputChange} className="bg-slate-800 text-white p-3 rounded-xl text-xs border-none font-bold" />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <button onClick={() => setShowDeleteConfirm(true)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleAction('save')} 
                    disabled={saving} 
                    className="bg-blue-600 px-8 py-3 rounded-2xl text-white font-black text-[10px] uppercase flex items-center gap-2 shadow-xl hover:bg-blue-500 active:scale-95 transition-all"
                  >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Entry
                  </button>
                </div>
              </div>

              {/* RECENT HISTORY LIST (NOW AUTOMATICALLY VISIBLE) */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Recent Records</h3>
                {currentCourse?.sessions && currentCourse.sessions.length > 0 ? (
                  [...currentCourse.sessions].reverse().slice(0, 5).map((session, idx) => (
                    <div key={session.id || idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:bg-white/[0.05] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                           <CalendarIcon size={14} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-[11px]">{session.date}</p>
                          <div className="flex gap-3 text-[8px] font-black uppercase tracking-tighter opacity-60">
                            <span className="text-purple-400">S:{session.simulation}</span>
                            <span className="text-blue-400">G:{session.ground}</span>
                            <span className="text-emerald-400">R:{session.road}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleAction('delete_session', currentCourse.sessions.length - 1 - idx)} className="p-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-2xl py-8 text-center">
                     <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest">No previous sessions for {selectedCategory}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
               <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em]">Select a vehicle to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NormalHajerBook;