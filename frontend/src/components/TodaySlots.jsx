import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalIcon, Clock, Users, Bike, Car, Truck, ShieldAlert } from 'lucide-react';

const API_URL = 'https://drivingschool-9b6b.onrender.com/api/slots';

const TodaySlots = ({ darkMode }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get(API_URL);
        setSlots(res.data);
      } catch (err) {
        console.error("Failed to load slots");
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  const formatTime12h = (time) => {
    if (!time) return '--:--';
    const [h, m] = time.split(':');
    const hh = parseInt(h);
    const suffix = hh >= 12 ? 'PM' : 'AM';
    const hour12 = hh % 12 || 12;
    return `${hour12}:${m} ${suffix}`;
  };

  if (loading) return <div className="text-center py-20 font-black uppercase tracking-widest opacity-50">Syncing Grid...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 mb-8">
        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Live Schedule</h3>
        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em]">Operational Training Windows</p>
      </div>

      {slots.length === 0 ? (
        <div className={`p-20 border-2 border-dashed rounded-[3rem] text-center ${darkMode ? 'border-white/5' : 'border-slate-200'}`}>
          <p className="text-[10px] font-black uppercase opacity-40">No slots published for this period</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {slots.map((slot) => (
            <div key={slot._id} className={`p-6 rounded-[2.5rem] border transition-all ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${slot.isClosed ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                      {slot.isClosed ? 'Closed' : 'Available'}
                    </span>
                    <span className="text-[10px] font-black uppercase opacity-40">{slot.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-500 font-black uppercase italic">
                    {slot.category === 'two-wheeler' && <Bike size={16} />}
                    {slot.category === 'four-wheeler' && <Car size={16} />}
                    {slot.category === 'heavy' && <Truck size={16} />}
                    <span className="text-sm tracking-tighter">{slot.category}</span>
                  </div>
                </div>
              </div>

              {slot.isClosed ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                  <ShieldAlert className="text-red-500" size={18} />
                  <p className="text-[10px] font-black uppercase text-red-500/80">Training center is closed for this session.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(slot.modules).map(([name, data]) => data.active && (
                    <div key={name} className={`p-4 rounded-2xl border ${darkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[8px] font-black uppercase opacity-50 tracking-widest">{name}</span>
                        <div className="flex items-center gap-1 text-blue-500">
                          <Users size={10} />
                          <span className="text-[9px] font-black">{data.capacity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-black uppercase italic text-emerald-500">
                        <Clock size={12} />
                        {formatTime12h(data.start)} — {formatTime12h(data.end)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodaySlots;