// components/Memories.jsx
import React, { useState } from 'react';
import { Car, ClipboardCheck, Star, Quote, User } from 'lucide-react';
import VehicleForm from './VehicleForm';
import LicenseForm from './LicenseForm';

const Memories = () => {
  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false);
  const [isLicenseFormOpen, setIsLicenseFormOpen] = useState(false);

  const testimonials = [
    { name: "Anju Joy", date: "2 months ago", text: "I had a great experience at JOHN'S DRIVING SCHOOL. My instructor, JOHN was patient and knowledgeable, making me feel comfortable from the start." },
    { name: "Liya Mariya Chacko", date: "6 months ago", text: "An excellent place to learn driving, with patient, supportive and knowledgeable instructor who makes you comfortable and confident." },
    { name: "Amrutha Thamban", date: "a year ago", text: "I had an outstanding experience. The instructor was exceptionally patient. The advanced simulator was so helpful." },
    { name: "Anisha Biju", date: "a year ago", text: "It was a great experience with driving school. They explain each and everything very patiently." },
    { name: "Niveditha P", date: "a year ago", text: "Great instructor, patient and knowledgeable. Their advanced simulator was incredibly realistic." },
    { name: "Edwin Abhilash", date: "a year ago", text: "My experience in this school 100% I'm satisfied and nice behavior to everyone." },
    { name: "Anina Biju", date: "a year ago", text: "One of the best driving school of Malakkallu." },
    { name: "Jose Kuruvilla", date: "a year ago", text: "Clear learning Experience." }
  ];

  return (
    <section id="testimonials" className="py-28 bg-slate-50 relative overflow-hidden">
      {/* Liquid Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Clean Header Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-6 shadow-sm">
            <Star className="text-yellow-400 fill-yellow-400" size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Google Verified Reviews</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black italic text-slate-900 tracking-tighter uppercase leading-none mb-6">
            Let Us <span className="text-blue-600">Remember</span>
          </h2>
          
          <p className="text-slate-500 max-w-xl font-medium leading-relaxed mb-10">
            Real stories from our students. Join the community of safe and confident drivers trained by John's.
          </p>
          
          {/* Refined Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setIsVehicleFormOpen(true)}
              className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-3 uppercase text-[10px] tracking-widest active:scale-95"
            >
              <Car size={18} /> Add Vehicle Entry
            </button>

            <button 
              onClick={() => setIsLicenseFormOpen(true)}
              className="bg-white text-slate-900 border-2 border-slate-900 px-10 py-5 rounded-2xl font-black hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-3 uppercase text-[10px] tracking-widest active:scale-95"
            >
              <ClipboardCheck size={18} /> Add License Entry
            </button>
          </div>
        </div>
        
        {/* REVIEWS GRID - Clean Spacing */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className="bg-white p-10 rounded-[3rem] text-left relative overflow-hidden group hover:bg-slate-900 transition-all duration-500 border border-slate-100 hover:border-slate-900 shadow-sm hover:shadow-2xl hover:shadow-blue-900/20"
            >
              <Quote className="text-blue-100 group-hover:text-blue-900 transition-colors absolute top-10 right-10" size={48} />
              
              <div className="relative z-10">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-slate-700 group-hover:text-slate-200 text-lg italic mb-10 leading-relaxed font-medium transition-colors">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-50 group-hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                    <User size={20} className="text-slate-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-tighter text-slate-900 group-hover:text-white transition-colors">{t.name}</h4>
                    <p className="text-blue-600 group-hover:text-blue-400 text-[10px] font-black uppercase tracking-widest transition-colors">{t.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BLURRED OVERLAY FORMS */}
      <VehicleForm isOpen={isVehicleFormOpen} onClose={() => setIsVehicleFormOpen(false)} />
      <LicenseForm isOpen={isLicenseFormOpen} onClose={() => setIsLicenseFormOpen(false)} />
    </section>
  );
};

export default Memories;