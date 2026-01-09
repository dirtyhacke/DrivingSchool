import React, { useState } from 'react';
import { Users, Calendar, Wallet, LogOut, ShieldCheck, LayoutGrid, Database } from 'lucide-react'; 
import AdminNavbar from './AdminNavbar';
import UsersRegistry from './UsersRegistry'; 
import UserDetailsView from './UserDetailsView';
import Scheduler from './Scheduler';
import Payments from './Payments';
import Slots from './Slots';
import StudentDatas from '../pages/StudentDatas';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('userdetails');

  const getHeaderTitle = () => {
    switch(activeTab) {
      case 'users': return 'Student Registry';
      case 'userdetails': return 'Master Ledger';
      case 'scheduler': return 'Operations Scheduler';
      case 'slots': return 'Slot Management';
      case 'payments': return 'Financial Ledger';
      case 'studen-datas': return 'Full Data Archive';
      default: return 'Management Console';
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-900 font-sans">
      
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
              <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-gray-900">
                {getHeaderTitle()}
              </h1>
              <p className="text-gray-600 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] mt-1 md:mt-2">
                System / {activeTab}
              </p>
            </div>
            
            <button 
              onClick={onLogout}
              className="lg:hidden p-3 bg-red-50 text-red-600 rounded-2xl border border-red-200 active:scale-95 transition-transform hover:bg-red-100"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Screen Content Wrapper */}
          <div className="bg-white border border-gray-200 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[600px] shadow-lg shadow-gray-200">
            {activeTab === 'users' && <UsersRegistry />}
            {activeTab === 'userdetails' && <UserDetailsView />}
            {activeTab === 'scheduler' && <Scheduler />}
            {activeTab === 'slots' && <Slots />}
            {activeTab === 'payments' && <Payments darkMode={false} />}
            {activeTab === 'studen-datas' && <StudentDatas />}
          </div>
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className="lg:hidden fixed bottom-6 left-4 right-4 z-[500]">
        <div className="bg-white/95 backdrop-blur-2xl border border-gray-200 p-2 rounded-[2.5rem] shadow-lg shadow-gray-300 flex items-center justify-around">
          
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
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105' 
      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
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