// components/Resources.jsx
import React from 'react';
// These must be here:
import { FileText, Download, ShieldCheck, ArrowRight } from 'lucide-react'; 

const Resources = () => {
  return (
    <section id="downloads" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Document Advisor */}
          <div id="advisor" className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <ShieldCheck size={30} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Document Advisor</h3>
            <p className="text-slate-600 mb-6">
              Not sure what you need? We help you prepare all necessary identity and age proofs.
            </p>
            <button className="flex items-center gap-2 text-blue-600 font-bold">
              Check Requirements <ArrowRight size={20} />
            </button>
          </div>

          {/* Downloads */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              <Download size={30} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Downloads</h3>
            <p className="text-slate-600 mb-6">
              Download PDF guides for road signs and mock theory test papers.
            </p>
            <div className="flex gap-3">
              <span className="bg-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-200 uppercase tracking-tighter">Road_Signs.pdf</span>
              <span className="bg-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-200 uppercase tracking-tighter">Mock_Test.pdf</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Resources;