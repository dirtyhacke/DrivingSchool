import React, { useState } from 'react';
import { Search, Car, ShieldCheck, Fuel, Activity, ArrowLeft, Loader2, Globe, AlertCircle, XCircle } from 'lucide-react';

const MVahanPortal = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [vehicleInput, setVehicleInput] = useState('');

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const cleanInput = vehicleInput.toUpperCase().replace(/\s/g, '');
    
    if (cleanInput.length < 6) {
        alert("Please enter a valid vehicle number.");
        return;
    }

    setLoading(true);
    setData(null);

    // Split: KL14AA1234 -> first=KL14, second=AA1234
    const first = cleanInput.substring(0, 4);
    const second = cleanInput.substring(4);

    try {
      const response = await fetch(`http://localhost:8080/api/mvd/search?first=${first}&second=${second}`);
      const result = await response.json();

      if (response.ok) {
        setData({
          owner: result["Owner Name"] || "N/A",
          fitness: result["Fitness Upto"] || "N/A",
          insurance: result["Insurance Upto"] || "N/A",
          fuel: result["Fuel Type"] || "N/A",
          rto: result["Registering Authority"] || "N/A",
          model: result["Maker Classification"] || "N/A"
        });
      } else {
        alert(result.error || "Details not found.");
      }
    } catch (err) {
      alert("Connection failed. Ensure backend is running at :8080");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 hover:text-blue-600 mb-8 transition-all">
          <ArrowLeft size={16}/> Back to Dashboard
        </button>

        <div className="mb-10">
          <h2 className="text-4xl font-black italic uppercase text-slate-900 leading-none">mVahan Portal</h2>
          <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span> Official MVD Data Fetch
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <form onSubmit={handleSearch} className="p-8">
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                value={vehicleInput}
                onChange={(e) => setVehicleInput(e.target.value)}
                placeholder="ENTER VEHICLE NO (E.G. KL60H8011)"
                className="flex-1 bg-slate-100 rounded-2xl py-5 px-6 font-bold uppercase outline-none focus:ring-2 ring-blue-500 transition-all"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : <><Search size={20}/> Search</>}
              </button>
            </div>
          </form>
        </div>

        {data && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-5">
            <InfoCard label="Owner" value={data.owner} sub={data.model} icon={<Car className="text-blue-600"/>}/>
            <InfoCard label="Fitness" value={data.fitness} sub={data.rto} icon={<Activity className="text-emerald-500"/>}/>
            <InfoCard label="Insurance" value={data.insurance} sub="Policy Active" icon={<ShieldCheck className="text-purple-500"/>}/>
            <InfoCard label="Fuel Type" value={data.fuel} sub="BS-VI Emission" icon={<Fuel className="text-orange-500"/>}/>
            
            <div className="md:col-span-2 bg-blue-900 p-6 rounded-3xl text-white flex items-start gap-4">
               <AlertCircle className="text-blue-400 shrink-0" size={24} />
               <div>
                  <h4 className="font-black text-xs uppercase mb-1">Safety Instruction</h4>
                  <p className="text-sm opacity-80">Always check your vehicle's physical condition (tires, brakes, and lights) regardless of document validity. Safety starts with inspection.</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, sub, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-4 items-start shadow-sm">
    <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <h4 className="text-lg font-black text-slate-900 leading-tight">{value}</h4>
      <p className="text-xs font-bold text-blue-600">{sub}</p>
    </div>
  </div>
);

export default MVahanPortal;