import React, { useState, useEffect } from 'react';
import { Loader2, User as UserIcon, Bike, Car, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import HajerBook from './HajerBook';

const Scheduler = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { fetchSchedulerData(); }, []);

  const fetchSchedulerData = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/scheduler/users');
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) { toast.error("Database Offline"); }
    finally { setLoading(false); }
  };

  const calculateCourseTotals = (course) => {
    if (!course || !course.attendance) return { S: 0, G: 0, R: 0 };
    const rows = course.gridRows || 30;
    const sectionSize = Math.floor(rows / 3);
    let totals = { S: 0, G: 0, R: 0 };
    course.attendance.forEach((status, index) => {
      if (status === 1) {
        const rowIndex = Math.floor(index / 50);
        if (rowIndex < sectionSize) totals.S++;
        else if (rowIndex < sectionSize * 2) totals.G++;
        else if (rowIndex < rows) totals.R++;
      }
    });
    return totals;
  };

  const getVehicleIcon = (type) => {
    if (type === 'two-wheeler') return <Bike size={10} />;
    if (type === 'heavy-vehicle') return <Truck size={10} />;
    return <Car size={10} />;
  };

  // --- NEW: HANDLES CLICKING THE GRID CELLS ---
  const handleCellClick = (userId, index, currentStatus, courseIndex = 0) => {
    const nextStatus = currentStatus === 1 ? 2 : currentStatus === 2 ? 0 : 1;
    setData(prev => prev.map(item => {
      if (item.user._id === userId) {
        // Handle both 'courses' or 'progress' keys for safety
        const key = item.courses ? 'courses' : 'progress';
        const updatedList = [...item[key]];
        const updatedCourse = { ...updatedList[courseIndex] };
        const newAttendance = [...updatedCourse.attendance];
        
        newAttendance[index] = nextStatus;
        updatedCourse.attendance = newAttendance;
        updatedList[courseIndex] = updatedCourse;

        return { ...item, [key]: updatedList };
      }
      return item;
    }));
  };

  // --- NEW: HANDLES CHANGING VEHICLE TYPE IN MODAL ---
  const handleStatusChange = (userId, type, courseIndex = 0) => {
    setData(prev => prev.map(item => {
      if (item.user._id === userId) {
        const key = item.courses ? 'courses' : 'progress';
        const updatedList = [...item[key]];
        updatedList[courseIndex] = { ...updatedList[courseIndex], vehicleType: type };
        return { ...item, [key]: updatedList };
      }
      return item;
    }));
  };

  const handleSave = async (userId, updatedCourses) => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:8080/api/admin/scheduler/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, courses: updatedCourses })
      });
      if (res.ok) {
        toast.success("Saved Successfully");
        setSelectedUser(null);
        fetchSchedulerData();
      }
    } catch (err) { toast.error("Network Error"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-blue-500"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-8 bg-[#020617] min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {data.map((item) => {
          const userCourses = item.courses || item.progress || [];
          return (
            <button key={item.user._id} onClick={() => setSelectedUser(item)} className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-white/5 hover:border-blue-500 transition-all flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl mb-4 flex items-center justify-center overflow-hidden border border-white/10">
                 {item.user.profileImage ? <img src={item.user.profileImage} className="w-full h-full object-cover" /> : <UserIcon className="text-slate-500" />}
              </div>
              <h4 className="text-white font-black uppercase text-[10px] tracking-widest text-center truncate w-full">{item.user.fullName}</h4>
              
              <div className="w-full mt-4 space-y-3">
                {userCourses.map((course, idx) => {
                  const totals = calculateCourseTotals(course);
                  return (
                    <div key={idx} className="bg-black/20 p-2 rounded-xl border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-blue-500">{getVehicleIcon(course.vehicleType)}</span>
                        <span className="text-[7px] text-slate-400 font-black uppercase italic">{course.vehicleType}</span>
                      </div>
                      <div className="flex justify-between gap-1 text-[9px] font-black">
                        <span className="flex-1 bg-white/5 py-1 rounded text-purple-400 text-center">S:{totals.S}</span>
                        <span className="flex-1 bg-white/5 py-1 rounded text-blue-400 text-center">G:{totals.G}</span>
                        <span className="flex-1 bg-white/5 py-1 rounded text-emerald-400 text-center">R:{totals.R}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>

      {selectedUser && (
        <HajerBook 
          selectedUser={selectedUser}
          currentUser={data.find(d => d.user._id === selectedUser.user._id)}
          onClose={() => setSelectedUser(null)}
          onSave={handleSave}
          onCellClick={handleCellClick}
          onStatusChange={handleStatusChange}
          saving={saving}
          setData={setData}
        />
      )}
    </div>
  );
};

export default Scheduler;