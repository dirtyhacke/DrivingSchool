import React, { useState } from 'react';
import { Users, Calendar, Wallet, LogOut, ShieldCheck, LayoutGrid, Database } from 'lucide-react'; 
import AdminNavbar from './AdminNavbar';
import UsersRegistry from './UsersRegistry'; 
import UserDetailsView from './UserDetailsView';
import Scheduler from './Scheduler';
import Payments from './Payments';
import Slots from './Slots';
import StudentDatas from '../pages/StudentDatas'; // 1. IMPORT STUDENT DATAS

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('userdetails');

  const getHeaderTitle = () => {
    switch(activeTab) {
      case 'users': return 'Student Registry';
      case 'userdetails': return 'Master Ledger';
      case 'scheduler': return 'Operations Scheduler';
      case 'slots': return 'Slot Management';
      case 'payments': return 'Financial Ledger';
      case 'studen-datas': return 'Full Data Archive'; // 2. ADD HEADER TITLE
      default: return 'Management Console';
    }
  };

  return (
    <div className="flex bg-[#020617] min-h-screen text-white font-sans">
      
      {/* --- SIDEBAR (Desktop Only) --- */}
      <div className="hidden lg:block">
        <AdminNavbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={onLogout} 
        />
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-72 p-4 md:p-10 pb-32 lg:pb-10">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header Section */}
          <div className="mb-6 md:mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">
                {getHeaderTitle()}
              </h1>
              <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] mt-1 md:mt-2">
                System / {activeTab}
              </p>
            </div>
            
            <button 
              onClick={onLogout}
              className="lg:hidden p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 active:scale-95 transition-transform"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Screen Content Wrapper */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[600px] shadow-2xl">
            {activeTab === 'users' && <UsersRegistry />}
            {activeTab === 'userdetails' && <UserDetailsView />}
            {activeTab === 'scheduler' && <Scheduler />}
            {activeTab === 'slots' && <Slots />}
            {activeTab === 'payments' && <Payments darkMode={true} />}
            {activeTab === 'studen-datas' && <StudentDatas />} {/* 3. RENDER NEW COMPONENT */}
          </div>
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className="lg:hidden fixed bottom-6 left-4 right-4 z-[500]">
        <div className="bg-[#0f172a]/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-around">
          
          <MobileNavBtn 
            icon={<Users size={20} />} 
            label="Users" 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')} 
          />

          <MobileNavBtn 
            icon={<ShieldCheck size={20} />} 
            label="Registry" 
            active={activeTab === 'userdetails'} 
            onClick={() => setActiveTab('userdetails')} 
          />
          
          <MobileNavBtn 
            icon={<LayoutGrid size={20} />} 
            label="Slots" 
            active={activeTab === 'slots'} 
            onClick={() => setActiveTab('slots')} 
          />

          {/* 4. ADD DATA TO MOBILE NAV */}
          <MobileNavBtn 
            icon={<Database size={20} />} 
            label="Data" 
            active={activeTab === 'studen-datas'} 
            onClick={() => setActiveTab('studen-datas')} 
          />
          
          <MobileNavBtn 
            icon={<Wallet size={20} />} 
            label="Pay" 
            active={activeTab === 'payments'} 
            onClick={() => setActiveTab('payments')} 
          />
          
        </div>
      </nav>
    </div>
  );
};

/* --- REUSABLE MOBILE BUTTON --- */
const MobileNavBtn = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-3 px-2 rounded-[1.5rem] transition-all duration-500 ${
      active 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-105' 
      : 'text-slate-400 hover:text-slate-200'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'scale-100'}`}>
      {icon}
    </div>
    <span className={`text-[7px] font-black uppercase mt-1 tracking-tighter ${active ? 'block animate-in fade-in' : 'hidden'}`}>
      {label}
    </span>
  </button>
);

export default AdminDashboard;