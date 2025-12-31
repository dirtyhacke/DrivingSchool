import React, { useEffect, useState } from 'react';
import { X, Save, Trophy, ArrowLeft, Loader2, Trash2, AlertCircle, PlusCircle, Bike, Car, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const HajerBook = ({ selectedUser, currentUser, onSave, onClose, onCellClick, onStatusChange, saving, setData }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);
  const [localCourses, setLocalCourses] = useState([]);

  // Initialize localCourses when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const rawData = currentUser?.courses || currentUser?.progress;
      if (Array.isArray(rawData) && rawData.length > 0) {
        setLocalCourses(rawData);
      } else {
        // Fallback if record is old or corrupted
        setLocalCourses([{
          vehicleType: currentUser?.vehicleType || 'four-wheeler',
          attendance: currentUser?.attendance || Array(1500).fill(0),
          gridRows: currentUser?.gridRows || 30,
          gridCols: currentUser?.gridCols || 50
        }]);
      }
    }
  }, [currentUser]);

  const activeCourse = localCourses[activeCourseIndex] || localCourses[0];

  // Logic constants
  const rows = activeCourse?.gridRows || 30;
  const cols = activeCourse?.gridCols || 50;
  const isFinished = activeCourse?.vehicleType === 'finished';
  const sectionSize = Math.floor(rows / 3);
  const colWidth = 40;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const updateGridSetting = (type, val) => {
    const limit = type === 'gridRows' ? 30 : 50;
    const value = Math.max(1, Math.min(limit, parseInt(val) || 1));
    
    const updatedCourses = localCourses.map((course, idx) => {
      if (idx === activeCourseIndex) {
        return { ...course, [type]: value };
      }
      return course;
    });
    
    setLocalCourses(updatedCourses);
    
    // Update parent data
    if (setData && selectedUser?.user?._id) {
      setData(prev => prev.map(item => {
        if (item.user._id === selectedUser.user._id) {
          return { ...item, progress: updatedCourses, courses: updatedCourses };
        }
        return item;
      }));
    }
  };

  const addNewCourse = () => {
    const newCourse = {
      vehicleType: 'two-wheeler',
      attendance: Array(1500).fill(0),
      gridRows: 30,
      gridCols: 50
    };

    const updatedCourses = [...localCourses, newCourse];
    setLocalCourses(updatedCourses);
    
    // Update parent data
    if (setData && selectedUser?.user?._id) {
      setData(prev => prev.map(item => 
        item.user._id === selectedUser.user._id 
          ? { ...item, progress: updatedCourses, courses: updatedCourses } 
          : item
      ));
    }
    
    setActiveCourseIndex(updatedCourses.length - 1);
    toast.success("New Course Added");
  };

  const handleCellClick = (rowIndex, colIndex) => {
    console.log(`Cell clicked: row=${rowIndex}, col=${colIndex}`);
    
    // Calculate cell index
    const cellIndex = rowIndex * 50 + colIndex;
    
    // Get current status
    const currentAttendance = [...activeCourse.attendance];
    const currentStatus = currentAttendance[cellIndex] || 0;
    
    // Cycle through status: 0 -> 1 -> 2 -> 0
    const newStatus = (currentStatus + 1) % 3;
    currentAttendance[cellIndex] = newStatus;
    
    // Update local state
    const updatedCourses = localCourses.map((course, idx) => {
      if (idx === activeCourseIndex) {
        return { ...course, attendance: currentAttendance };
      }
      return course;
    });
    
    setLocalCourses(updatedCourses);
    
    // Call parent handler
    if (onCellClick) {
      onCellClick(selectedUser.user._id, cellIndex, newStatus, activeCourseIndex);
    }
    
    // Update parent data
    if (setData && selectedUser?.user?._id) {
      setData(prev => prev.map(item => {
        if (item.user._id === selectedUser.user._id) {
          return { ...item, progress: updatedCourses, courses: updatedCourses };
        }
        return item;
      }));
    }
  };

  const handleStatusChange = (newVehicleType) => {
    const updatedCourses = localCourses.map((course, idx) => {
      if (idx === activeCourseIndex) {
        return { ...course, vehicleType: newVehicleType };
      }
      return course;
    });
    
    setLocalCourses(updatedCourses);
    
    // Call parent handler
    if (onStatusChange) {
      onStatusChange(selectedUser.user._id, newVehicleType, activeCourseIndex);
    }
    
    // Update parent data
    if (setData && selectedUser?.user?._id) {
      setData(prev => prev.map(item => {
        if (item.user._id === selectedUser.user._id) {
          return { ...item, progress: updatedCourses, courses: updatedCourses };
        }
        return item;
      }));
    }
  };

  const handleWipeOrDelete = () => {
    if (localCourses.length > 1) {
      const filteredCourses = localCourses.filter((_, idx) => idx !== activeCourseIndex);
      setLocalCourses(filteredCourses);
      
      // Update parent data
      if (setData && selectedUser?.user?._id) {
        setData(prev => prev.map(item => {
          if (item.user._id === selectedUser.user._id) {
            return { ...item, progress: filteredCourses, courses: filteredCourses };
          }
          return item;
        }));
      }
      
      setActiveCourseIndex(0);
      toast.success("Category Deleted Locally");
    } else {
      const resetCourse = { 
        ...localCourses[0], 
        attendance: Array(1500).fill(0) 
      };
      setLocalCourses([resetCourse]);
      
      // Update parent data
      if (setData && selectedUser?.user?._id) {
        setData(prev => prev.map(item => 
          item.user._id === selectedUser.user._id 
            ? { ...item, progress: [resetCourse], courses: [resetCourse] } 
            : item
        ));
      }
      toast.success("Ledger Cleared");
    }
    setShowConfirm(false);
  };

  const getIcon = (type) => {
    if (type === 'two-wheeler') return <Bike size={14} />;
    if (type === 'heavy-vehicle') return <Truck size={14} />;
    return <Car size={14} />;
  };

  // If data is still resolving, show a spinner
  if (!activeCourse || localCourses.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999999] bg-[#020617] flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
      
      {showConfirm && (
        <div className="fixed inset-0 z-[1000000] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-white font-black uppercase italic text-xl">
              {localCourses.length > 1 ? 'Delete Category?' : 'Wipe Ledger?'}
            </h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-widest">
              {localCourses.length > 1 ? 'This will remove this specific course.' : 'This clears all marked sessions.'}
            </p>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-white/5 text-white rounded-xl font-black text-[10px] uppercase">Cancel</button>
              <button onClick={handleWipeOrDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase underline">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-full bg-[#0d1117] md:rounded-[2.5rem] flex flex-col overflow-hidden relative shadow-2xl border border-white/10">
        
        <div className="px-6 py-4 bg-[#161b22] border-b border-white/10 flex items-center justify-between z-[100]">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 bg-white/5 rounded-xl text-white"><ArrowLeft size={20} /></button>
            <div>
              <h2 className="text-white font-black uppercase italic text-lg leading-none">{selectedUser.user.fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-blue-500 text-[8px] font-black uppercase tracking-widest">Hajer ID: {selectedUser.user._id.slice(-6)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => onSave(selectedUser.user._id, localCourses)} disabled={saving} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg text-white font-black text-[10px] uppercase flex items-center gap-2 transition-all">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
            <button onClick={onClose} className="p-2 bg-white/5 text-slate-400 hover:text-red-500 rounded-xl"><X size={20} /></button>
          </div>
        </div>

        <div className="px-6 py-2 bg-[#1c2128] border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {localCourses.map((course, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCourseIndex(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                activeCourseIndex === idx 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white/5 text-slate-500 hover:bg-white/10'
              }`}
            >
              {getIcon(course.vehicleType)}
              {(course.vehicleType || 'Unknown').replace('-', ' ')}
            </button>
          ))}
          <button 
            onClick={addNewCourse}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-500/20"
          >
            <PlusCircle size={14} /> Add New
          </button>
        </div>

        <div className="px-6 py-3 bg-[#0d1117] border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <span className="text-[9px] font-black text-slate-500 uppercase italic">Configure:</span>
              <select 
                value={activeCourse.vehicleType} 
                onChange={(e) => handleStatusChange(e.target.value)} 
                className="bg-slate-800 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border-none outline-none ring-1 ring-white/10"
              >
                <option value="two-wheeler">2 Wheeler</option>
                <option value="four-wheeler">4 Wheeler</option>
                <option value="heavy-vehicle">Heavy</option>
                <option value="finished">Finished ✅</option>
              </select>
           </div>
           
           <div className="flex items-center gap-4">
              {!isFinished && (
                <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        value={rows} 
                        onChange={(e) => updateGridSetting('gridRows', e.target.value)} 
                        className="w-8 bg-transparent text-blue-400 text-center font-black text-[9px] outline-none border-b border-blue-500/30" 
                    />
                    <span className="text-[7px] font-black text-slate-500 uppercase">Rows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        value={cols} 
                        onChange={(e) => updateGridSetting('gridCols', e.target.value)} 
                        className="w-8 bg-transparent text-emerald-400 text-center font-black text-[9px] outline-none border-b border-emerald-500/30" 
                    />
                    <span className="text-[7px] font-black text-slate-500 uppercase">Cols</span>
                  </div>
                </div>
              )}
              <button onClick={() => setShowConfirm(true)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/10">
                <Trash2 size={16} />
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar bg-[#0d1117]">
          {isFinished ? (
            <div className="h-full flex flex-col items-center justify-center animate-in zoom-in duration-500">
              <Trophy size={80} className="text-emerald-500 mb-4 drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]" />
              <h2 className="text-2xl font-black text-white uppercase italic">Course Completed</h2>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-2">The training ledger for this category is locked.</p>
            </div>
          ) : (
            <div className="min-w-max relative">
              <div className="flex sticky top-0 z-[60] bg-[#161b22] border-b border-white/10">
                <div className="w-[100px] bg-[#0d1117] border-r border-white/20"></div>
                <div style={{ width: `${cols * colWidth}px` }} className="flex text-[10px] font-black uppercase tracking-[0.5em] italic">
                   <div className="flex-1 py-4 text-center text-purple-400 bg-purple-500/5 border-r border-white/5">Simulation</div>
                   <div className="flex-1 py-4 text-center text-blue-400 bg-blue-500/5 border-r border-white/5">Ground Training</div>
                   <div className="flex-1 py-4 text-center text-emerald-400 bg-emerald-500/5">Road Practice</div>
                </div>
              </div>

              <div>
                {[...Array(rows)].map((_, rowIndex) => {
                  let char = rowIndex >= sectionSize * 2 ? 'R' : rowIndex >= sectionSize ? 'G' : 'S';
                  let color = char === 'R' ? 'text-emerald-400' : char === 'G' ? 'text-blue-400' : 'text-purple-400';

                  return (
                    <div key={rowIndex} className="flex border-b border-white/5">
                      <div className={`w-[100px] h-10 flex items-center justify-center text-[9px] font-black sticky left-0 z-40 bg-[#161b22] border-r border-white/20 ${color}`}>
                        {char}-{rowIndex + 1}
                      </div>
                      {[...Array(cols)].map((_, colIndex) => {
                        const cellIndex = rowIndex * 50 + colIndex;
                        const status = activeCourse.attendance?.[cellIndex] || 0;
                        return (
                          <button 
                            key={colIndex} 
                            onClick={() => handleCellClick(rowIndex, colIndex)} 
                            className={`w-10 h-10 border-r border-white/5 flex items-center justify-center transition-all cursor-pointer ${
                              status === 1 ? 'bg-emerald-600/10' : 
                              status === 2 ? 'bg-red-600/10' : 
                              'hover:bg-white/5'
                            }`}
                          >
                            <span className={`text-[11px] font-black ${status === 1 ? 'text-emerald-500' : status === 2 ? 'text-red-500' : 'text-transparent'}`}>
                              {status === 1 ? char : status === 2 ? 'A' : ''}
                            </span>
                            {status === 0 && <div className="w-1 h-1 bg-white/10 rounded-full" />}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HajerBook;