import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Car, Loader2, ArrowLeft, Calendar, CreditCard, 
  ChevronDown, CheckCircle2, Globe, ShieldAlert, AlertCircle 
} from 'lucide-react';

const MVahanPortal = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [isSlotOpen, setIsSlotOpen] = useState(false);
  const [idType, setIdType] = useState('application'); 
  const [bookingData, setBookingData] = useState({ idValue: '', dob: '' });
  
  // New State for the Warning Window
  const [showWarning, setShowWarning] = useState(true);

  const handleStartBooking = async () => {
    if (!bookingData.idValue || !bookingData.dob) return alert("Fill all fields");
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/vehicle/book-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idValue: bookingData.idValue,
          dob: bookingData.dob,
          type: idType
        })
      });
      const res = await response.json();
      if (res.success) alert("Automation Window Opened on Server!");
      else alert("Error: " + res.error);
    } catch (err) {
      alert("Connection failed to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 px-6 relative">
      
      {/* --- NON-CLOSABLE POPUP WINDOW --- */}
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border-4 border-amber-500"
            >
              <div className="bg-amber-500 p-8 flex flex-col items-center text-white">
                <ShieldAlert size={64} className="mb-4 animate-pulse" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">System Alert</h3>
              </div>

              <div className="p-8 text-center">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 justify-center text-amber-600">
                    <AlertCircle size={20} />
                    <span className="font-black text-xs uppercase tracking-widest">Server Maintenance</span>
                  </div>
                  <p className="text-slate-600 font-bold text-sm uppercase leading-relaxed">
                    The push notification server is currently <span className="text-red-600">offline for maintenance</span>. 
                    Browser automation may experience delays.
                  </p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                    Access to Parivahan portal is strictly monitored.
                  </p>
                </div>

                {/* Action Buttons: No X, only Proceed or Back */}
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setShowWarning(false)}
                    className="w-full bg-blue-600 text-white font-black uppercase italic py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                  >
                    I Understand & Proceed
                  </button>
                  <button 
                    onClick={onBack}
                    className="w-full bg-slate-100 text-slate-500 font-black uppercase text-[10px] py-3 rounded-xl hover:bg-slate-200 transition-all tracking-[0.2em]"
                  >
                    Cancel & Go Back
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN UI CONTENT --- */}
      <div className="max-w-4xl mx-auto pt-20">
        <button onClick={onBack} className="flex items-center gap-2 mb-10 font-black text-[10px] uppercase tracking-widest text-slate-500">
          <ArrowLeft size={16}/> Back
        </button>

        <h2 className="text-5xl font-black uppercase italic mb-12">mVahan <span className="text-blue-600">Portal</span></h2>

        {/* DL Slot Booking Dropdown */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border overflow-hidden">
          <button onClick={() => setIsSlotOpen(!isSlotOpen)} className="w-full p-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-2xl">
                <Calendar className="text-blue-600" size={32}/>
              </div>
              <span className="text-xl font-black uppercase italic">Book DL-Slot</span>
            </div>
            <ChevronDown className={`transition-transform ${isSlotOpen ? 'rotate-180' : ''}`}/>
          </button>

          <AnimatePresence>
            {isSlotOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="p-8 pt-0 border-t">
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  {/* Type Selector */}
                  <div className="flex gap-2">
                    {['application', 'll'].map(t => (
                      <button key={t} onClick={() => setIdType(t)} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase border-2 transition-all ${idType === t ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}>
                        {t} No
                      </button>
                    ))}
                  </div>
                  {/* ID Input */}
                  <input 
                    type="text" placeholder="Number" 
                    className="bg-slate-50 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-blue-500 transition-all"
                    onChange={(e) => setBookingData({...bookingData, idValue: e.target.value})}
                  />
                  {/* DOB Input */}
                  <input 
                    type="date" 
                    className="bg-slate-50 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-blue-500 transition-all"
                    onChange={(e) => setBookingData({...bookingData, dob: e.target.value})}
                  />
                  <button onClick={handleStartBooking} disabled={loading} className="bg-blue-600 text-white font-black uppercase py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                    {loading ? <Loader2 className="animate-spin"/> : <><Globe size={18}/> Start Scraping</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MVahanPortal;