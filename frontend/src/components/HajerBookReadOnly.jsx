import React, { useState, useEffect } from 'react';
import { X, Trophy, Bike, Car, Truck } from 'lucide-react';

const HajerBookReadOnly = ({ progress, userName, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Normalize data into an array
  const allCourses = Array.isArray(progress) ? progress : [progress];
  const activeCourse = allCourses[activeTab] || allCourses[0];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (!activeCourse) return null;

  const { attendance = [], gridRows = 30, gridCols = 50, vehicleType } = activeCourse;
  const sectionSize = Math.floor(gridRows / 3);

  const getIcon = (type) => {
    if (type === 'two-wheeler') return <Bike size={14} />;
    if (type === 'heavy-vehicle') return <Truck size={14} />;
    return <Car size={14} />;
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
      <div className="w-full h-full bg-[#0d1117] md:rounded-[2.5rem] flex flex-col overflow-hidden border border-white/10 shadow-2xl">
        <div className="px-6 py-4 bg-[#161b22] border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-white font-black uppercase italic text-lg">{userName}'s Progress</h2>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Official Training Ledger</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 text-white rounded-xl hover:bg-red-500 transition-all"><X size={20}/></button>
        </div>

        {allCourses.length > 1 && (
          <div className="px-6 py-2 bg-[#1c2128] border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {allCourses.map((course, idx) => (
              <button key={idx} onClick={() => setActiveTab(idx)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === idx ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}>
                {getIcon(course.vehicleType)} {course.vehicleType?.replace('-', ' ')}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-auto custom-scrollbar bg-[#0d1117]">
          {vehicleType === 'finished' ? (
             <div className="h-full flex flex-col items-center justify-center p-10 text-center animate-in zoom-in">
                <Trophy size={80} className="text-emerald-500 mb-4 animate-bounce" />
                <h2 className="text-2xl font-black text-white uppercase italic">Training Completed!</h2>
             </div>
          ) : (
            <div className="min-w-max relative">
              <div className="flex sticky top-0 z-50 bg-[#161b22] border-b border-white/10 font-black text-[9px] uppercase italic tracking-widest text-center">
                <div className="w-[80px] shrink-0 bg-[#0d1117] border-r border-white/20"></div>
                <div className="flex-1 py-3 text-purple-400">Simulation</div>
                <div className="flex-1 py-3 text-blue-400">Ground</div>
                <div className="flex-1 py-3 text-emerald-400">Road</div>
              </div>
              {[...Array(gridRows)].map((_, rowIndex) => {
                let char = rowIndex >= sectionSize * 2 ? 'R' : rowIndex >= sectionSize ? 'G' : 'S';
                let color = char === 'R' ? 'text-emerald-400' : char === 'G' ? 'text-blue-400' : 'text-purple-400';
                return (
                  <div key={rowIndex} className="flex border-b border-white/5">
                    <div className={`w-[80px] h-10 flex items-center justify-center text-[9px] font-black sticky left-0 bg-[#161b22] border-r border-white/10 z-40 ${color}`}>{char}-{rowIndex + 1}</div>
                    {[...Array(gridCols)].map((_, colIndex) => {
                      const status = attendance[rowIndex * 50 + colIndex] || 0;
                      return (
                        <div key={colIndex} className={`w-10 h-10 border-r border-white/5 flex items-center justify-center ${status === 1 ? 'bg-emerald-500/10' : status === 2 ? 'bg-red-500/10' : ''}`}>
                          <span className={`text-[10px] font-black ${status === 1 ? 'text-emerald-500' : status === 2 ? 'text-red-500' : 'text-transparent'}`}>{status === 1 ? char : status === 2 ? 'A' : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HajerBookReadOnly;