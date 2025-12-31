import React from 'react';
import { Users, Calendar, LogOut, ShieldCheck, ChevronRight, CreditCard, LayoutGrid } from 'lucide-react';

const AdminNavbar = ({ activeTab, setActiveTab, onLogout, isHajerBookOpen }) => {
  if (isHajerBookOpen) return null;

  const navItems = [
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'userdetails', label: 'Registry', icon: <ShieldCheck size={20} /> },
    { id: 'scheduler', label: 'Scheduler', icon: <Calendar size={20} /> },
    { id: 'slots', label: 'Slots', icon: <LayoutGrid size={20} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="fixed z-[500] transition-all duration-300
      /* Desktop: Fixed Left Sidebar */
      lg:left-0 lg:top-0 lg:w-72 lg:min-h-screen lg:border-r lg:border-white/5 lg:p-6 lg:bg-[#0f172a] lg:flex lg:flex-col
      /* Mobile: Fixed Bottom Bar */
      left-0 bottom-0 w-full bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 p-2 pb-6 lg:pb-6 flex flex-row lg:block 
      shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      
      {/* --- DESKTOP LOGO (Hidden on Mobile) --- */}
      <div className="hidden lg:flex items-center gap-3 mb-12 px-2">
        <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
          <ShieldCheck size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase italic tracking-tighter text-white">Admin Node</h2>
          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Control Center</p>
        </div>
      </div>

      {/* --- NAVIGATION CONTENT --- */}
      <nav className="flex lg:flex-col items-center justify-around lg:justify-start gap-1 lg:gap-2 flex-1 w-full lg:w-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center lg:justify-between p-3 lg:p-4 rounded-2xl transition-all duration-300 group 
              relative flex-col lg:flex-row w-full max-w-[80px] lg:max-w-none ${
              activeTab === item.id 
                ? 'text-blue-500 lg:bg-blue-600 lg:text-white lg:shadow-lg lg:shadow-blue-500/20' 
                : 'text-slate-400 hover:text-white lg:hover:bg-white/5'
            }`}
          >
            {/* Mobile Active Indicator Dot */}
            {activeTab === item.id && (
              <div className="lg:hidden absolute -top-2 w-1 h-1 bg-blue-50 rounded-full shadow-[0_0_8px_blue]" />
            )}

            <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-4 font-black text-[8px] lg:text-xs uppercase tracking-tighter lg:tracking-wider">
              <div className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'scale-100'}`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </div>
            
            <div className="hidden lg:block text-white/50 group-hover:text-white">
              {activeTab === item.id && <ChevronRight size={14} />}
            </div>
          </button>
        ))}

        {/* --- MOBILE LOGOUT (Hidden on Desktop) --- */}
        <button 
          onClick={onLogout}
          className="lg:hidden flex flex-col items-center gap-1 p-3 text-red-500/50 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Exit</span>
        </button>
      </nav>

      {/* --- DESKTOP FOOTER --- */}
      <div className="hidden lg:block pt-6 border-t border-white/5 mt-auto">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-400 transition-all rounded-2xl hover:bg-red-500/5 font-black text-xs uppercase tracking-widest"
        >
          <LogOut size={20} />
          Terminate Session
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;