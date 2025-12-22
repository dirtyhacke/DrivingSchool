import React, { useState } from 'react';
import { FileText, Smartphone, Download, ExternalLink, ShieldCheck, X, Eye, Info } from 'lucide-react';

const Downloads = () => {
  const [activeModal, setActiveModal] = useState(null);

  const downloadItems = [
    {
      title: "Your Safety Guide",
      desc: "Comprehensive road safety rules based on John's Safety Booklet.",
      icon: <ShieldCheck className="text-blue-600" />,
      action: "View Guide",
      type: "view",
      id: "safety-guide"
    },
    {
      title: "Learning License Guide",
      desc: "Mandatory Kerala road signs and traffic signals for LL test.",
      icon: <FileText className="text-emerald-600" />,
      action: "View Signs",
      type: "view",
      id: "ll-guide"
    },
    {
      title: "Mparivahan Android",
      desc: "Official app for Virtual RC & DL on Android.",
      icon: <Smartphone className="text-slate-900" />,
      action: "Play Store",
      link: "https://play.google.com/store/apps/details?id=com.nic.mparivahan",
      type: "app"
    },
    {
      title: "Mparivahan iPhone",
      desc: "Official app for Virtual RC & DL on iOS.",
      icon: <Smartphone className="text-slate-900" />,
      action: "App Store",
      link: "https://apps.apple.com/in/app/mparivahan/id1161358461",
      type: "app"
    }
  ];

  return (
    <section id="downloads" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4">Resources</h4>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">
            Downloads & <span className="text-blue-600">Resources</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {downloadItems.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-black uppercase text-sm mb-2 tracking-tight">{item.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-8 font-medium">{item.desc}</p>
              
              {item.type === 'view' ? (
                <button 
                  onClick={() => setActiveModal(item.id)}
                  className="flex items-center justify-between w-full bg-blue-600 text-white px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors"
                >
                  {item.action} <Eye size={14} />
                </button>
              ) : (
                <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center justify-between w-full bg-slate-950 text-white px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors">
                  {item.action} <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL SYSTEM */}
      {activeModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setActiveModal(null)} />
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-black uppercase italic tracking-tighter text-2xl">
                  {activeModal === 'safety-guide' ? "John's Safety Guide" : "Kerala Road Signs"}
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Official Resource Center</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-3 bg-white shadow-md rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Smooth Scroll) */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
              {activeModal === 'safety-guide' ? <SafetyGuideContent /> : <LLGuideContent />}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// --- CONTENT COMPONENTS ---

const SafetyGuideContent = () => (
  <div className="space-y-10 font-medium text-slate-700 leading-relaxed">
    <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
      <h4 className="font-black text-blue-900 uppercase mb-4 flex items-center gap-2"><Info size={18}/> ആമുഖം (Introduction)</h4>
      <p>ഡ്രൈവിംഗ് ഒരു അവകാശവും ഉത്തരവാദിത്തവുമാണ്. ഓരോ ഡ്രൈവറും സുരക്ഷിതവും ഉത്തരവാദിത്വമുള്ളതുമായ രീതിയിൽ വാഹനമോടിക്കേണ്ടതുണ്ട്[cite: 258].</p>
    </div>

    <section>
      <h3 className="text-xl font-black uppercase mb-6 text-slate-900 border-l-4 border-blue-600 pl-4">1. യാത്ര ആരംഭിക്കുന്നതിന് മുമ്പ് (Pre-Drive Inspection)</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-6 rounded-2xl">
          <h5 className="font-black text-xs uppercase mb-3">വാഹന പരിശോധന (Outside)</h5>
          <ul className="text-sm space-y-2 list-disc ml-4">
            <li>ടയർ പ്രഷർ, മുഴകൾ, സ്പെയർ ടയർ പരിശോധിക്കുക[cite: 266, 269].</li>
            <li>ലൈറ്റുകൾ (ഹെഡ്‌ലൈറ്റ്, ബ്രേക്ക്, ഇൻഡിക്കേറ്റർ)[cite: 271].</li>
            <li>ഫ്ലൂയിഡ് നിലകൾ (ഓയിൽ, ബ്രേക്ക് ഫ്ലൂയിഡ്, കൂളന്റ്)[cite: 275].</li>
          </ul>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl">
          <h5 className="font-black text-xs uppercase mb-3">വാഹനത്തിനുള്ളിൽ (Inside)</h5>
          <ul className="text-sm space-y-2 list-disc ml-4">
            <li>സീറ്റ് ക്രമീകരണം & സീറ്റ് ബെൽറ്റ്[cite: 287, 289].</li>
            <li>മൊബൈൽ ഫോൺ ഉപയോഗം ഒഴിവാക്കുക[cite: 292].</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="bg-slate-900 text-white p-8 rounded-[2rem]">
      <h3 className="text-xl font-black uppercase mb-6 italic tracking-tighter">മൂന്ന് സെക്കൻഡ് റൂൾ (Three-Second Rule)</h3>
      <p className="text-sm text-slate-400 mb-6">മുൻവാഹനത്തിനൊപ്പം സുരക്ഷിതമായ അകലം പാലിക്കാൻ ഇത് സഹായിക്കുന്നു[cite: 381].</p>
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-black">1</div>
          <p className="text-sm">ഒരു സ്ഥിരമായ പോയിൻ്റ് കണ്ടെത്തുക (മരം അല്ലെങ്കിൽ പോസ്റ്റ്)[cite: 383].</p>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-black">2</div>
          <p className="text-sm">മുന്നിലുള്ള വാഹനം അത് കടക്കുമ്പോൾ 1, 2, 3 എന്ന് എണ്ണുക[cite: 384].</p>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-black">3</div>
          <p className="text-sm">3 സെക്കൻഡിന് ശേഷം നിങ്ങൾ അവിടെ എത്തിയാൽ നിങ്ങൾ സുരക്ഷിതനാണ്[cite: 386].</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-black uppercase mb-6 text-slate-900 border-l-4 border-emerald-600 pl-4">ഡച്ച് റീച്ച് രീതി (Dutch Reach)</h3>
      <p className="text-sm mb-4">വാഹനം നിർത്തി ഇറങ്ങുമ്പോൾ സൈക്കിളിസ്റ്റുകളെ സംരക്ഷിക്കാൻ വാതിലിന് ദൂരെയുള്ള കൈ ഉപയോഗിച്ച് വാതിൽ തുറക്കുക[cite: 401, 407]. ഇത് നിങ്ങളുടെ ശരീരം സ്വാഭാവികമായി പിന്നോട്ട് തിരിക്കാൻ സഹായിക്കുന്നു[cite: 408].</p>
    </section>

    <div className="text-[10px] text-slate-400 text-center pt-8 border-t">
      തയ്യാറാക്കിയത്: സെബാസ്റ്റ്യൻ എൻ ജെ, ജോൺസ് ഡ്രൈവിംഗ് സ്കൂൾ, മാലക്കല്ല് [cite: 504]
    </div>
  </div>
);

const LLGuideContent = () => {
  const signs = [
    { name: "Stop", color: "bg-red-600", shape: "octagon", desc: "Mandatory stop before proceeding" },
    { name: "No Entry", color: "bg-red-500", shape: "circle", desc: "Entry strictly prohibited" },
    { name: "Right Turn Prohibited", color: "bg-red-500", shape: "circle", desc: "Do not turn right" },
    { name: "One Way", color: "bg-blue-600", shape: "circle", desc: "Traffic moves in one direction" },
    { name: "Speed Limit 50", color: "bg-white border-4 border-red-500", shape: "circle", desc: "Max speed 50 km/h" },
    { name: "Narrow Bridge", color: "bg-amber-500", shape: "triangle", desc: "Road narrows ahead" }
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {signs.map((sign, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-4">
            <div className={`w-24 h-24 shadow-lg flex items-center justify-center text-[10px] font-black text-white p-2
              ${sign.shape === 'circle' ? 'rounded-full' : sign.shape === 'octagon' ? 'rounded-lg rotate-45' : 'clip-triangle bg-amber-500'} 
              ${sign.color}`}>
              <span className={sign.shape === 'octagon' ? '-rotate-45' : ''}>{sign.name}</span>
            </div>
            <div>
              <p className="font-black uppercase text-[10px] tracking-widest">{sign.name}</p>
              <p className="text-slate-500 text-[10px] leading-tight mt-1">{sign.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100">
        <h4 className="font-black uppercase text-amber-900 text-sm mb-4">Test Tips</h4>
        <ul className="text-xs space-y-3 text-amber-800 font-medium">
          <li>• mandatory signs are usually circular with a red border.</li>
          <li>• Cautionary signs are triangular.</li>
          <li>• Informatory signs are rectangular and blue.</li>
        </ul>
      </div>
    </div>
  );
};

export default Downloads;