import React from 'react';
import { 
  FileText, 
  ClipboardCheck, 
  Truck, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle, 
  Info, 
  ArrowRight, 
  MessageSquare, 
  Phone 
} from 'lucide-react';

const Advisor = () => {
  const requirements = [
    {
      id: "01",
      title: "Learner's License",
      subtitle: "The First Step (LL)",
      accent: "from-blue-600 to-cyan-500",
      icon: <FileText size={24} />,
      link: "https://sarathi.parivahan.gov.in/",
      points: [
        { title: "Age Proof", desc: "Birth Certificate / 10th Class Cert" },
        { title: "Address Proof", desc: "Aadhar / Voter ID / Passport" },
        { title: "Form 1A", desc: "Medical Certificate (Required if Age > 40)" },
        { title: "Photos", desc: "Passport size & Eye Test Certificate" }
      ],
      tip: "Apply online via parivahan.gov.in"
    },
    {
      id: "02",
      title: "Permanent License",
      subtitle: "The Final Goal (DL)",
      accent: "from-emerald-600 to-teal-400",
      icon: <CheckCircle size={24} />,
      link: "https://mvd.kerala.gov.in/",
      points: [
        { title: "Original LL", desc: "Must have valid Learner's License" },
        { title: "Form 5", desc: "Driving School Certificate" },
        { title: "Fee Receipt", desc: "Digital payment confirmation" },
        { title: "Form 4", desc: "Permanent License Application" }
      ],
      tip: "Required for the final driving test"
    },
    {
      id: "03",
      title: "Transport / Commercial",
      subtitle: "For Professionals",
      accent: "from-orange-600 to-yellow-500",
      icon: <Truck size={24} />,
      link: "https://sarathi.parivahan.gov.in/",
      points: [
        { title: "Existing DL", desc: "Original Non-Transport License" },
        { title: "Training Cert", desc: "Govt. Recognized Form 5" },
        { title: "Badge Number", desc: "For Auto / Taxi / Bus drivers" },
        { title: "Medical", desc: "Compulsory Fitness Certificate" }
      ],
      tip: "Mandatory for commercial driving"
    }
  ];

  return (
    <section id="advisor" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-0 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -z-0 opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6">
              <ShieldAlert className="text-blue-400" size={16} />
              <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">MVD Kerala Guidelines</span>
            </div>
            <h2 className="text-6xl font-black italic text-white tracking-tighter uppercase leading-[0.9]">
              Document <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Advisor</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-xs font-medium border-l-2 border-blue-600 pl-6 italic">
            "Don't let paperwork stop your journey. Bring these to John's Driving School and we'll handle the rest."
          </p>
        </div>

        {/* Requirements Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {requirements.map((item) => (
            <div key={item.id} className="group relative">
              {/* Floating ID Number */}
              <span className="absolute -top-10 -left-4 text-8xl font-black text-white/5 group-hover:text-white/10 transition-colors pointer-events-none italic uppercase">
                {item.id}
              </span>

              <div className="h-full bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[3.5rem] p-10 flex flex-col hover:border-white/20 transition-all duration-500 shadow-2xl">
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center text-white mb-8 shadow-lg shadow-black/50`}>
                  {item.icon}
                </div>

                <div className="mb-8">
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">{item.subtitle}</p>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{item.title}</h3>
                </div>

                <div className="space-y-6 flex-grow">
                  {item.points.map((point, pIdx) => (
                    <div key={pIdx} className="flex gap-4 group/item">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 group-hover/item:scale-150 transition-transform"></div>
                      <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-tight">{point.title}</h4>
                        <p className="text-slate-400 text-[11px] mt-0.5 font-medium">{point.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pro Tip Box */}
                <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-3">
                  <Info className="text-blue-400 shrink-0" size={16} />
                  <p className="text-[10px] text-slate-300 italic font-medium">{item.tip}</p>
                </div>

                <a 
                  href={item.link} 
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 flex items-center justify-between w-full p-5 bg-white text-slate-900 rounded-[2rem] font-black text-[10px] tracking-[0.2em] uppercase hover:bg-blue-600 hover:text-white transition-all group/btn active:scale-95"
                >
                  Apply via Portal <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CRITICAL VERIFICATION & CONTACT SECTION */}
        <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-transparent border border-white/5 rounded-[3rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-md">
          
          <div className="flex items-center gap-6 max-w-xl">
            <div className="bg-blue-600 text-white p-4 rounded-2xl animate-pulse shadow-lg shadow-blue-600/40">
              <ShieldAlert size={28} />
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tighter mb-1">
                Critical Verification Note
              </p>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Originals are <span className="text-white italic">strictly required</span> for verification during your driving test. Ensure all documents are clear, valid, and match your online application.
              </p>
            </div>
          </div>

          {/* CONTACT BUTTONS */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* WhatsApp Link */}
            <a 
              href="https://wa.me/919400107199?text=Hi%20John's%20Driving%20School,%20I%20need%20help%20with%20my%20documents."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl shadow-green-900/20 active:scale-95"
            >
              <MessageSquare size={18} /> WhatsApp Chat
            </a>

            {/* Direct Call Link */}
            <a 
              href="tel:+919400107199"
              className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95"
            >
              <Phone size={18} /> Call Directly
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Advisor;