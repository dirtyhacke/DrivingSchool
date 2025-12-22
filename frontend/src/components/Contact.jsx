import React, { useState, useRef } from 'react';
import { MapPin, Phone, Mail, Upload, Send, Star, Navigation, ArrowRight, BellRing, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [fileAttached, setFileAttached] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileAttached(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('fullName', e.target.fullName.value);
    formData.append('email', e.target.email.value);
    formData.append('registrationNumber', e.target.registrationNumber.value);
    
    if (fileAttached) {
      formData.append('document', fileAttached);
    }

    try {
      const response = await fetch('https://drivingschool-9b6b.onrender.com/api/reminders/activate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Details submitted to John's Driving School!", {
          style: {
            border: '1px solid #1e293b',
            padding: '16px',
            color: '#fff',
            background: '#0f172a',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase'
          },
        });
        setIsSubmitted(true);
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch (error) {
      toast.error("Server connection failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFileAttached(null);
    if (formRef.current) formRef.current.reset();
  };

  return (
    <section id="ContactUs" className="py-28 bg-white relative overflow-hidden">
      {/* Background Liquid Detail */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -z-10 opacity-60"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Contact Info & Map */}
        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-2 mb-6 bg-slate-50 w-fit px-4 py-2 rounded-full border border-slate-100">
               {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Top Rated in Malakkallu</span>
            </div>
            
            <h2 className="text-6xl font-black italic text-slate-900 uppercase tracking-tighter leading-[0.9] mb-8">
              Get In <br /> <span className="text-blue-600">Touch</span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-5 items-start group">
                <div className="bg-blue-50 p-4 rounded-2xl group-hover:bg-blue-600 transition-colors">
                  <MapPin className="text-blue-600 group-hover:text-white transition-colors" size={20} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-xs text-slate-400 tracking-widest mb-1">Our Location</h4>
                  <p className="text-slate-700 font-bold leading-relaxed max-w-sm">
                    opp. PRINCY FURNITURE, Malakkallu, Kerala 671532
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-5 items-center group">
                  <div className="bg-blue-50 p-4 rounded-2xl group-hover:bg-blue-600 transition-colors">
                    <Phone className="text-blue-600 group-hover:text-white transition-colors" size={20} />
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-xs text-slate-400 tracking-widest mb-1">Direct Call</h4>
                    <a href="tel:+919400107199" className="text-slate-900 font-black hover:text-blue-600 transition-colors">+91 9400107199</a>
                  </div>
                </div>

                <div className="flex gap-5 items-center group">
                  <div className="bg-blue-50 p-4 rounded-2xl group-hover:bg-blue-600 transition-colors">
                    <Mail className="text-blue-600 group-hover:text-white transition-colors" size={20} />
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-xs text-slate-400 tracking-widest mb-1">Email Us</h4>
                    <a href="mailto:info@johnsrider.com" className="text-slate-900 font-black hover:text-blue-600 transition-colors">info@johnsrider.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl h-80 border-4 border-white ring-1 ring-slate-100 group">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5037.520473596539!2d75.27330097602558!3d12.443826926227613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba48b45a552f64f%3A0x19a7bda751a8942f!2sJOHN&#39;S%20DRIVING%20SCHOOL!5e1!3m2!1sen!2sin!4v1766332873490!5m2!1sen!2sin"  referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0 grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              allowFullScreen="" 
              loading="lazy">
            </iframe>
            
            <a 
              href="https://maps.app.goo.gl/7fNRLpviVajenC3k7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black shadow-2xl flex items-center gap-3 hover:bg-blue-600 transition-all active:scale-95 uppercase tracking-widest"
            >
              <Navigation size={14} /> Open in Google Maps
            </a>
          </div>
        </div>

        {/* Right Side: Pro Reminder & Mail Service */}
        <div className="bg-slate-950 rounded-[4rem] p-10 md:p-14 text-white shadow-2xl relative border border-white/5 min-h-[600px] flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10">
            {!isSubmitted ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <BellRing className="text-blue-500" size={24} />
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">Pro Reminder</h3>
                </div>
                <p className="text-slate-400 mb-10 text-xs font-medium uppercase tracking-[0.1em] leading-relaxed">
                  Activate automated alerts for <span className="text-white">Insurance, Permit, and Fitness</span> expiry directly to your phone.
                </p>
                
                <form ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Full Name</label>
                      <input name="fullName" type="text" placeholder="Owner Name" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Your Email</label>
                      <input name="email" type="email" placeholder="notifications@mail.com" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Registration Number</label>
                    <input name="registrationNumber" type="text" placeholder="KL-60-A-1234" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all" required />
                  </div>
                  
                  <div className="relative group border-2 border-dashed border-white/10 rounded-[2rem] p-10 text-center hover:border-blue-500/50 hover:bg-blue-600/5 cursor-pointer transition-all duration-300">
                    <input type="file" name="document" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${fileAttached ? 'bg-emerald-500 rotate-[360deg]' : 'bg-white/5 group-hover:bg-blue-600'}`}>
                      <Upload className="text-white" size={24} />
                    </div>
                    <p className={`text-xs font-black uppercase tracking-widest transition-colors ${fileAttached ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'}`}>
                      {fileAttached ? fileAttached.name : "Upload RC / Insurance Copy"}
                    </p>
                    <p className="text-[9px] text-slate-500 mt-2 font-medium">PDF or High-quality JPG supported</p>
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 uppercase text-xs tracking-[0.2em] mt-4 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>ACTIVATE NOW <ArrowRight size={18} /></>}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Service Activated</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8">
                  We have received your documents. <br /> You will receive alerts before expiry.
                </p>
                <button 
                  onClick={resetForm}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Submit Another
                </button>
              </div>
            )}

            {!isSubmitted && (
              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 italic">Or bypass the form</p>
                 <a href="mailto:info@johnsrider.com" className="inline-flex items-center gap-3 text-blue-500 font-black hover:text-white transition-all text-xs uppercase tracking-tighter">
                   <Mail size={16} /> Contact Support Direct
                 </a>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;