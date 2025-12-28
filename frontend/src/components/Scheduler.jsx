import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, User as UserIcon, Bike, Car, Truck, Grid, BookOpen, X, Search, ChevronRight, History } from 'lucide-react';
import toast from 'react-hot-toast';
import HajerBook from './HajerBook';
import NormalHajerBook from './NormalHajerBook';

const Scheduler = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => { fetchSchedulerData(); }, []);

  const fetchSchedulerData = async () => {
    try {
      const res = await fetch('https://drivingschool-9b6b.onrender.com/api/admin/scheduler/users');
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) { 
      toast.error("Database Offline"); 
    } finally { 
      setLoading(false); 
    }
  };

  // --- CRITICAL LOGIC: Unified Session Extractor ---
  const getSessionLog = (item) => {
    if (!item) return [];
    // Check both potential keys from the database
    const source = item.courses || item.progress || [];
    let allSessions = [];
    
    source.forEach(course => {
      if (course.sessions && Array.isArray(course.sessions)) {
        course.sessions.forEach(s => {
          allSessions.push({ ...s, vehicle: course.vehicleType });
        });
      }
    });

    // Sort by date (Newest first)
    return allSessions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const calculateCourseTotals = (course) => {
    if (!course || !course.attendance) return { S: 0, G: 0, R: 0, total: 0 };
    const rows = course.gridRows || 30;
    const sectionSize = Math.floor(rows / 3);
    let totals = { S: 0, G: 0, R: 0, total: 0 };
    course.attendance.forEach((status, index) => {
      if (status === 1) {
        totals.total++;
        const rowIndex = Math.floor(index / 50);
        if (rowIndex < sectionSize) totals.S++;
        else if (rowIndex < sectionSize * 2) totals.G++;
        else if (rowIndex < rows) totals.R++;
      }
    });
    return totals;
  };

  const getVehicleIcon = (type) => {
    switch(type) {
      case 'two-wheeler': return <Bike size={14} className="text-blue-400" />;
      case 'heavy-vehicle': return <Truck size={14} className="text-orange-400" />;
      default: return <Car size={14} className="text-emerald-400" />;
    }
  };

  const handleSave = async (userId, updatedCourses) => {
    setSaving(true);
    try {
      const res = await fetch('https://drivingschool-9b6b.onrender.com/api/admin/scheduler/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, courses: updatedCourses, progress: updatedCourses })
      });
      if (res.ok) {
        toast.success("Saved Successfully");
        fetchSchedulerData(); // Refresh all data to ensure logs sync
      }
    } catch (err) { toast.error("Network Error"); }
    finally { setSaving(false); }
  };

  const closeModals = () => {
    setSelectedUser(null);
    setActiveView(null);
    setShowOptions(false);
  };

  const filteredData = useMemo(() => {
    return data.filter(item => item.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery]);

  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-blue-500 gap-4">
      <Loader2 className="animate-spin" size={40} />
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing Records...</span>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#020617] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-white text-2xl font-black uppercase italic tracking-tighter">Student Hub</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{filteredData.length} Students Listed</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search student..." 
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:ring-1 ring-blue-500/50"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* STUDENT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredData.map((item) => {
          const sessions = getSessionLog(item);
          const userCourses = item.courses || item.progress || [];

          return (
            <div key={item.user._id} className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 group flex flex-col relative overflow-hidden transition-all hover:bg-slate-900/60">
              
              {/* HISTORY BUTTON ON CARD */}
              <button 
                onClick={() => { setSelectedUser(item); setActiveView('history'); }}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl transition-all z-10 flex items-center gap-1"
              >
                <History size={14} />
                {sessions.length > 0 && <span className="text-[9px] font-black">{sessions.length}</span>}
              </button>

              <div className="cursor-pointer" onClick={() => { setSelectedUser(item); setShowOptions(true); }}>
                <div className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl overflow-hidden border border-white/10 shrink-0">
                    {item.user.profileImage ? <img src={item.user.profileImage} className="w-full h-full object-cover" alt="" /> : <UserIcon className="text-slate-600 w-full h-full p-3" />}
                  </div>
                  <div className="min-w-0 pr-8">
                    <h4 className="text-white font-black uppercase text-[10px] truncate">{item.user.fullName}</h4>
                    <p className="text-slate-500 text-[8px] font-bold">{item.user.phone || 'NO PHONE'}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-4">
                  {userCourses.map((course, idx) => {
                    const totals = calculateCourseTotals(course);
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-[8px] font-black uppercase">
                          <div className="flex items-center gap-1">{getVehicleIcon(course.vehicleType)} {course.vehicleType}</div>
                          <span className="text-blue-500">{course.sessions?.length || 0} SESSIONS</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="bg-white/5 rounded-lg py-1 text-center text-purple-400 text-[9px] font-black">S:{totals.S}</div>
                          <div className="bg-white/5 rounded-lg py-1 text-center text-blue-400 text-[9px] font-black">G:{totals.G}</div>
                          <div className="bg-white/5 rounded-lg py-1 text-center text-emerald-400 text-[9px] font-black">R:{totals.R}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SHARED HISTORY MODAL */}
      {activeView === 'history' && selectedUser && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-[2.5rem] flex flex-col max-h-[80vh] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h3 className="text-white font-black uppercase text-xs">{selectedUser.user.fullName}</h3>
                <p className="text-blue-500 text-[9px] font-black uppercase mt-1 tracking-widest">Attendance Logs</p>
              </div>
              <button onClick={closeModals} className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="p-4 overflow-y-auto custom-scrollbar space-y-3">
              {getSessionLog(selectedUser).length > 0 ? (
                getSessionLog(selectedUser).map((s, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">{getVehicleIcon(s.vehicle)}</div>
                      <div>
                        <p className="text-white font-black text-[11px] mb-1">{s.date} <span className="ml-2 text-[8px] text-slate-500 uppercase">{s.vehicle}</span></p>
                        <div className="flex gap-4 text-[9px] font-black uppercase">
                          <span className="text-purple-400">Sim: {s.simulation}</span>
                          <span className="text-blue-400">Grd: {s.ground}</span>
                          <span className="text-emerald-400">Rod: {s.road}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center opacity-20 text-[10px] font-black uppercase tracking-[0.3em]">No Logs Found For This User</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SELECTION MODAL */}
      {showOptions && selectedUser && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="bg-[#0f172a] border border-white/10 p-8 rounded-[3rem] max-w-sm w-full relative">
            <button onClick={closeModals} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X size={24} /></button>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-slate-800 rounded-[2rem] mx-auto mb-4 border border-white/10 overflow-hidden">
                 {selectedUser.user.profileImage ? <img src={selectedUser.user.profileImage} className="w-full h-full object-cover" /> : <UserIcon className="text-slate-600 w-full h-full p-5" />}
              </div>
              <h3 className="text-white font-black uppercase tracking-widest">{selectedUser.user.fullName}</h3>
            </div>
            <div className="grid gap-3">
              <button onClick={() => { setActiveView('grid'); setShowOptions(false); }} className="flex items-center gap-4 bg-white/5 hover:bg-blue-600 p-5 rounded-2xl text-white transition-all group border border-white/5">
                <Grid className="text-blue-400 group-hover:text-white" />
                <div className="text-left"><p className="font-black uppercase text-[11px]">Grid View</p></div>
              </button>
              <button onClick={() => { setActiveView('normal'); setShowOptions(false); }} className="flex items-center gap-4 bg-white/5 hover:bg-emerald-600 p-5 rounded-2xl text-white transition-all group border border-white/5">
                <BookOpen className="text-emerald-400 group-hover:text-white" />
                <div className="text-left"><p className="font-black uppercase text-[11px]">Quick Update</p></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTHER VIEWS */}
      {activeView === 'grid' && selectedUser && (
        <HajerBook selectedUser={selectedUser} currentUser={data.find(d => d.user._id === selectedUser.user._id)} onClose={closeModals} onSave={handleSave} saving={saving} />
      )}
      {activeView === 'normal' && selectedUser && (
        <NormalHajerBook selectedUser={selectedUser} currentUser={data.find(d => d.user._id === selectedUser.user._id)} onClose={closeModals} onSave={handleSave} saving={saving} />
      )}
    </div>
  );
};

export default Scheduler;