import React, { useState, useEffect } from 'react';
import { Bike, Car, Truck, Table, Loader2, AlertCircle } from 'lucide-react';
import HajerBookReadOnly from './HajerBookReadOnly';

const TrainingCenter = ({ darkMode, userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const fetchMyProgress = async () => {
      // 1. Get ID from props or fallback to localStorage
      const activeId = userId || JSON.parse(localStorage.getItem('user'))?._id;
      
      if (!activeId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/users/progress/${activeId}`);
        const result = await res.json();
        
        console.log("DEBUG: Data from Server:", result);

        if (result.success) {
          setUserData(result.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProgress();
  }, [userId]);

  // THIS FUNCTION FINDS YOUR DATA NO MATTER WHERE IT IS
  const getProgressArray = () => {
    if (!userData) return [];

    // Check new 'courses' field first
    if (userData.courses && Array.isArray(userData.courses) && userData.courses.length > 0) {
      return userData.courses;
    }

    // Check old 'progress' field next
    if (userData.progress) {
      if (Array.isArray(userData.progress)) return userData.progress;
      if (typeof userData.progress === 'object' && userData.progress.attendance) {
        return [userData.progress];
      }
    }

    // Check if the response itself is the array
    if (Array.isArray(userData)) return userData;

    return [];
  };

  const getPhaseTotals = (course) => {
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

  const getUI = (type) => {
    switch(type) {
      case 'two-wheeler': return { name: "Two Wheeler", icon: <Bike size={32}/>, desc: "Class A" };
      case 'heavy-vehicle': return { name: "Heavy Vehicle", icon: <Truck size={32}/>, desc: "Class C" };
      default: return { name: "Four Wheeler", icon: <Car size={32}/>, desc: "Class B" };
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  const coursesList = getProgressArray();

  if (coursesList.length === 0) return (
    <div className="p-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-center bg-white/[0.02] max-w-lg mx-auto mt-10">
      <AlertCircle className="mx-auto text-yellow-500 mb-4" size={48} />
      <h3 className="text-white font-black uppercase italic text-xl">Data Syncing...</h3>
      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">
        We found your account, but the training courses are not loading. 
        Please click "Save" on the Admin panel for this user to refresh the database.
      </p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {coursesList.map((course, idx) => {
        const totals = getPhaseTotals(course);
        const ui = getUI(course.vehicleType);
        return (
          <div key={idx} onClick={() => setShowTable(true)} className={`p-6 lg:p-10 rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between group cursor-pointer transition-all ${darkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-200 shadow-xl'}`}>
            <div className="flex items-center gap-6">
              <div className="p-5 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/40 group-hover:scale-105 transition-transform">{ui.icon}</div>
              <div>
                <h3 className={`font-black uppercase italic text-2xl leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>{ui.name}</h3>
                <p className="text-[10px] font-bold uppercase opacity-40 tracking-widest mt-1">{ui.desc}</p>
              </div>
            </div>
            <div className="flex gap-8 mt-8 md:mt-0 items-center">
              <div className="text-center"><p className="text-purple-500 text-[9px] font-black uppercase mb-1">Sim</p><p className={`${darkMode ? 'text-white' : 'text-slate-900'} text-2xl font-black italic`}>{totals.S}</p></div>
              <div className="text-center"><p className="text-blue-500 text-[9px] font-black uppercase mb-1">Gnd</p><p className={`${darkMode ? 'text-white' : 'text-slate-900'} text-2xl font-black italic`}>{totals.G}</p></div>
              <div className="text-center"><p className="text-emerald-500 text-[9px] font-black uppercase mb-1">Road</p><p className={`${darkMode ? 'text-white' : 'text-slate-900'} text-2xl font-black italic`}>{totals.R}</p></div>
              <div className="p-3 bg-blue-600/10 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all ml-4"><Table size={20} /></div>
            </div>
          </div>
        );
      })}
      {showTable && <HajerBookReadOnly progress={coursesList} userName={userData?.user?.fullName || "Student"} onClose={() => setShowTable(false)} />}
    </div>
  );
};

export default TrainingCenter;