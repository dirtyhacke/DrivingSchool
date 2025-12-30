import React, { useState } from 'react';
import { 
  Car, ClipboardCheck, Star, Quote, User, 
  ChevronRight, X, Send, MessageSquareText, PenLine 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VehicleForm from './VehicleForm';
import LicenseForm from './LicenseForm';

const Memories = () => {
  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false);
  const [isLicenseFormOpen, setIsLicenseFormOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', text: '' });

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

  const initialReviews = testimonials.slice(0, 4);

  const handlePostReview = () => {
    console.log("Review Submitted:", newReview);
    setIsWriteOpen(false);
    setNewReview({ name: '', text: '' });
  };

  return (
    <section id="testimonials" className="py-28 bg-slate-50 relative overflow-hidden">
      {/* Liquid Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-6 shadow-sm">
            <Star className="text-yellow-400 fill-yellow-400" size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Google Verified Reviews</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black italic text-slate-900 tracking-tighter uppercase leading-none mb-6">
            Let Us <span className="text-blue-600">Remember</span>
          </h2>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button 
              onClick={() => setIsVehicleFormOpen(true)}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-lg flex items-center gap-3 uppercase text-[9px] tracking-widest"
            >
              <Car size={16} /> Add Vehicle Entry
            </button>
            <button 
              onClick={() => setIsLicenseFormOpen(true)}
              className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-black hover:bg-emerald-600 hover:text-white transition-all shadow-lg flex items-center gap-3 uppercase text-[9px] tracking-widest"
            >
              <ClipboardCheck size={16} /> Add License Entry
            </button>
          </div>
        </div>

        {/* INITIAL REVIEWS GRID */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {initialReviews.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, starI) => <Star key={starI} size={12} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <Quote className="text-slate-100 group-hover:text-blue-100 transition-colors" size={32} />
              </div>
              <p className="text-slate-700 italic font-medium leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black text-xs">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tighter text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-blue-600 text-[9px] font-black uppercase tracking-widest">{t.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
          <button 
            onClick={() => setIsMoreOpen(true)}
            className="group bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-4 hover:bg-blue-600 transition-all shadow-xl active:scale-95"
          >
            View All Reviews <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={() => setIsWriteOpen(true)}
            className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-4 hover:bg-slate-900 transition-all shadow-xl active:scale-95"
          >
            <PenLine size={18} /> Write Your Review
          </button>
        </div>
      </div>

      {/* MODAL: WRITE REVIEW POPUP */}
      <AnimatePresence>
        {isWriteOpen && (
          <div className="fixed inset-0 z-[1050] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsWriteOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <MessageSquareText size={120} />
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Post Review</h3>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Share your experience</p>
                </div>
                <button onClick={() => setIsWriteOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="ENTER YOUR NAME" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-black uppercase text-xs outline-none focus:ring-2 ring-blue-500/20"
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Your Experience</label>
                  <textarea 
                    rows="4" 
                    placeholder="HOW WAS YOUR TRAINING AT JOHN'S?" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-medium text-sm outline-none focus:ring-2 ring-blue-500/20"
                    value={newReview.text}
                    onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  onClick={handlePostReview}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl mt-4"
                >
                  <Send size={16} /> Submit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: VIEW ALL REVIEWS TABLE */}
      <AnimatePresence>
        {isMoreOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsMoreOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Review Database</h3>
                <button onClick={() => setIsMoreOpen(false)} className="p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <th className="px-6 pb-4">Student</th>
                      <th className="px-6 pb-4">Experience</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((t, i) => (
                      <tr key={i} className="group bg-slate-50 hover:bg-blue-600 transition-colors">
                        <td className="px-6 py-5 rounded-l-2xl border-y border-l border-transparent">
                          <span className="font-black uppercase text-xs text-slate-900 group-hover:text-white whitespace-nowrap">{t.name}</span>
                        </td>
                        <td className="px-6 py-5 rounded-r-2xl text-sm font-medium text-slate-600 group-hover:text-white italic leading-relaxed">
                          "{t.text}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <VehicleForm isOpen={isVehicleFormOpen} onClose={() => setIsVehicleFormOpen(false)} />
      <LicenseForm isOpen={isLicenseFormOpen} onClose={() => setIsLicenseFormOpen(false)} />
    </section>
  );
};

export default Memories;