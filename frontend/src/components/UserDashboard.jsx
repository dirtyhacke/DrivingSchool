import React, { useState } from 'react';
import { User, Award, Settings, LogOut, Car, Sun, Moon, ChevronRight, Wallet, LayoutGrid, Database } from 'lucide-react';
import UserSettings from './UserSettings';
import TrainingCenter from './TrainingCenter';
import UserPayment from './UserPayment';
import TodaySlots from './TodaySlots';
import MyAllData from './MyAllData'; // Import the new component

const UserDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('training');
  const [darkMode, setDarkMode] = useState(true);

  const userId = user?._id || JSON.parse(localStorage.getItem('user'))?._id;

  return (
    <div className={`fixed inset-0 z-[400] flex flex-col lg:flex-row font-sans transition-colors duration-500 ${darkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className={`hidden lg:flex w-72 border-r flex-col p-6 transition-colors ${darkMode ? 'border-white/5 bg-white/[0.02]' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/20"><Car size={22} /></div>
          <div>
            <h1 className="font-black italic uppercase text-lg leading-none">{user?.fullName?.split(' ')[0] || "Student"}'s</h1>
            <p className="text-[8px] text-blue-400 font-black uppercase tracking-widest mt-1">Driving School</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarBtn icon={<Award size={20}/>} label="Training" active={activeTab === 'training'} onClick={() => setActiveTab('training')} darkMode={darkMode} />
          <SidebarBtn icon={<LayoutGrid size={20}/>} label="Today Slots" active={activeTab === 'slots'} onClick={() => setActiveTab('slots')} darkMode={darkMode} />
          <SidebarBtn icon={<Wallet size={20}/>} label="Payments" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} darkMode={darkMode} />
          {/* NEW: My All Data Navigation Button */}
          <SidebarBtn icon={<Database size={20}/>} label="My All Data" active={activeTab === 'alldata'} onClick={() => setActiveTab('alldata')} darkMode={darkMode} />
          <SidebarBtn icon={<Settings size={20}/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} darkMode={darkMode} />
        </nav>

        <div className="pt-4 border-t border-white/5 space-y-2">
           <button onClick={() => setDarkMode(!darkMode)} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}>
             <div className="flex items-center gap-4">
                {darkMode ? <Sun size={18} className="text-yellow-500"/> : <Moon size={18} className="text-blue-600"/>}
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Appearance</span>
             </div>
           </button>
           <div className={`flex items-center gap-3 p-4 rounded-2xl mb-2 ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500 border border-blue-500/20"><User size={16} /></div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black uppercase truncate">{user?.fullName || "Active Student"}</p>
                <p className="text-[8px] opacity-40 truncate">{user?.email}</p>
              </div>
           </div>
           <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/10 rounded-2xl transition-all">
             <LogOut size={18}/> Sign Out
           </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
        <header className={`p-6 lg:p-10 flex justify-between items-center sticky top-0 z-30 backdrop-blur-md ${darkMode ? 'bg-[#020617]/80' : 'bg-slate-50/80'}`}>
          <div className="flex items-center gap-4">
             <div className="lg:hidden bg-blue-600 p-2 rounded-lg text-white"><Car size={18} /></div>
             <h2 className="text-2xl font-black italic uppercase tracking-tighter">
               {activeTab === 'training' ? 'Training Center' : 
                activeTab === 'slots' ? 'Today Schedule' : 
                activeTab === 'payments' ? 'Payment History' : 
                activeTab === 'alldata' ? 'My Complete Data' : 
                activeTab === 'settings' ? 'Settings' : ''}
             </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right">
                <p className="text-[9px] font-black uppercase opacity-40">Session Status</p>
                <div className="flex items-center gap-1 justify-end">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[10px] font-bold text-emerald-500 uppercase">Authenticated</p>
                </div>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="lg:hidden p-3 bg-blue-600/10 rounded-2xl text-blue-600">
              {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-5xl mx-auto">
          {activeTab === 'training' && (userId ? <TrainingCenter darkMode={darkMode} userId={userId} /> : <SessionError />)}
          {activeTab === 'slots' && <TodaySlots darkMode={darkMode} />}
          {activeTab === 'payments' && (userId ? <UserPayment darkMode={darkMode} userId={userId} /> : <SessionError />)}
          {/* NEW: My All Data Component */}
          {activeTab === 'alldata' && (userId ? <MyAllData darkMode={darkMode} userId={userId} /> : <SessionError />)}
          {activeTab === 'settings' && <UserSettings user={user} onLogout={onLogout} darkMode={darkMode} />}
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around px-6 z-50 backdrop-blur-xl ${darkMode ? 'bg-[#020617]/90 border-white/5' : 'bg-white/90 border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]'}`}>
        <MobileBtn icon={<Award size={22}/>} active={activeTab === 'training'} onClick={() => setActiveTab('training')} />
        <MobileBtn icon={<LayoutGrid size={22}/>} active={activeTab === 'slots'} onClick={() => setActiveTab('slots')} />
        <MobileBtn icon={<Wallet size={22}/>} active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
        <MobileBtn icon={<Database size={22}/>} active={activeTab === 'alldata'} onClick={() => setActiveTab('alldata')} />
        <button onClick={onLogout} className="p-4 text-red-500/50"><LogOut size={22}/></button>
      </nav>
    </div>
  );
};

const SidebarBtn = ({icon, label, active, onClick, darkMode}) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : `opacity-50 hover:opacity-100 ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}`}>
    <div className="flex items-center gap-4">{icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span></div>
    {active && <ChevronRight size={14} className="opacity-50" />}
  </button>
);

const MobileBtn = ({icon, active, onClick}) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'opacity-30'}`}>{icon}</button>
);

const SessionError = () => (
    <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-red-500/20 rounded-[3rem] text-center">
        <div className="bg-red-500/10 p-4 rounded-full text-red-500 mb-4"><LogOut size={32} /></div>
        <h3 className="text-lg font-black uppercase italic">Session ID Missing</h3>
        <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-2 max-w-xs">Please sign out and back in.</p>
    </div>
);

export default UserDashboard;