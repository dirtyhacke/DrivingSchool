import React, { useState } from 'react';
import { Search, Car, ShieldCheck, Fuel, Activity, ArrowLeft, Loader2, AlertCircle, MapPin, ClipboardList } from 'lucide-react';

const MVahanPortal = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [vehicleInput, setVehicleInput] = useState('');
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const cleanInput = vehicleInput.toUpperCase().replace(/\s/g, '');
    
    if (cleanInput.length < 6) {
        setError("Please enter a valid vehicle number (min 6 characters).");
        return;
    }

    setLoading(true);
    setData(null);
    setError(null);

    // Extract parts: KL14AA1234 -> first=KL14, second=AA1234
    const first = cleanInput.substring(0, 4);
    const second = cleanInput.substring(4);

    try {
      // Use localhost:8080 instead of Render URL
      const response = await fetch(`http://localhost:8080/api/mvd/search?first=${first}&second=${second}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        setData({
          owner: result["Owner Name"] || result.owner || "N/A",
          fitness: result["Fitness Upto"] || result.fitness || "N/A",
          insurance: result["Insurance Upto"] || result.insurance || "N/A",
          fuel: result["Fuel Type"] || result.fuel || "N/A",
          rto: result["Registering Authority"] || result.rto || "N/A",
          model: result["Maker Classification"] || result.model || "N/A"
        });
      } else {
        setError(result.error || result.details || "Vehicle details not found.");
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Connection failed: ${err.message}. Make sure backend is running on port 8080.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6 font-sans relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 mb-10 transition-all tracking-[0.2em] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Dashboard
        </button>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <div className="h-1 w-12 bg-blue-600 rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Verification System</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black italic uppercase text-slate-900 leading-[0.9] tracking-tighter">
            mVahan <br /> <span className="text-blue-600">Portal</span>
          </h2>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-slate-200/60 p-2">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1 group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                <Car size={20} />
              </div>
              <input 
                value={vehicleInput}
                onChange={(e) => {
                  setVehicleInput(e.target.value);
                  setError(null);
                }}
                placeholder="ENTER VEHICLE NO (E.G. KL60H8011)"
                className="w-full bg-slate-50 rounded-[2rem] py-6 pl-16 pr-6 font-black uppercase outline-none focus:bg-white focus:ring-4 ring-blue-500/10 transition-all text-slate-800 placeholder:text-slate-300 tracking-wider"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-slate-900 text-white px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-600 active:scale-95 disabled:bg-slate-200 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              {loading ? <Loader2 className="animate-spin" size={20}/> : <><Search size={20}/> Fetch Details</>}
            </button>
          </form>
        </div>

        {/* Search Format Tip */}
        <p className="mt-4 ml-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
           <ClipboardList size={14} /> Format: State Code + District + Series + Number
        </p>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 animate-in fade-in">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle size={20} />
              <h4 className="font-black text-sm uppercase tracking-widest">Error</h4>
            </div>
            <p className="text-sm font-medium">{error}</p>
            <p className="text-xs mt-3 text-red-600 font-bold">
              Backend URL: http://localhost:8080/api/mvd/search
            </p>
          </div>
        )}

        {data ? (
          <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoCard label="Registered Owner" value={data.owner} sub={data.model} icon={<Car className="text-blue-600"/>}/>
              <InfoCard label="Fitness Validity" value={data.fitness} sub={data.rto} icon={<Activity className="text-emerald-500"/>} highlight />
              <InfoCard label="Insurance Upto" value={data.insurance} sub="Digital Policy verified" icon={<ShieldCheck className="text-purple-500"/>}/>
              <InfoCard label="Fuel & Emission" value={data.fuel} sub="Standard Compliance" icon={<Fuel className="text-orange-500"/>}/>
            </div>
            
            <div className="bg-blue-600 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl shadow-blue-600/20">
               <div className="bg-white/20 p-4 rounded-2xl">
                 <AlertCircle size={32} />
               </div>
               <div className="text-center md:text-left">
                  <h4 className="font-black text-sm uppercase tracking-widest mb-1">Safety First</h4>
                  <p className="text-sm font-medium text-blue-50 opacity-90 leading-relaxed">
                    Always maintain physical copies of documents while driving. This data is for reference purposes and reflects the latest MVD records.
                  </p>
               </div>
            </div>
          </div>
        ) : !error && (
          <div className="mt-20 text-center opacity-20 grayscale flex flex-col items-center">
             <MapPin size={48} className="mb-4" />
             <p className="font-black uppercase tracking-[0.4em] text-xs text-slate-900">
               {loading ? 'Fetching data from localhost:8080...' : 'Waiting for query...'}
             </p>
             {!loading && (
               <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
                 Example: KL60H8011
               </p>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, sub, icon, highlight }) => (
  <div className={`group bg-white p-8 rounded-[2.5rem] border border-slate-100 flex gap-6 items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${highlight ? 'ring-2 ring-emerald-500/10' : ''}`}>
    <div className="p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <div className="flex-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h4 className="text-xl font-black text-slate-900 leading-tight mb-1">{value}</h4>
      <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{sub}</p>
    </div>
  </div>
);

export default MVahanPortal;