import React, { useState } from 'react';
import { Users, LogOut, ShieldCheck, ChevronRight, CreditCard, LayoutGrid, Database, Menu, X } from 'lucide-react';

const AdminNavbar = ({ activeTab, setActiveTab, onLogout, isHajerBookOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isHajerBookOpen) return null;

  const navItems = [
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'userdetails', label: 'Registry', icon: <ShieldCheck size={20} /> },
    { id: 'slots', label: 'Slots', icon: <LayoutGrid size={20} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'studen-datas', label: 'Database', icon: <Database size={20} /> },
  ];

  // Handle navigation click on mobile
  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); // Close menu on mobile after selection
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Hidden on mobile) --- */}
      <aside className="hidden lg:flex fixed z-[500] left-0 top-0 w-72 h-screen border-r border-gray-100 bg-white flex-col px-6 py-8 transition-all duration-500 ease-in-out">
        
        {/* Branding */}
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-gray-900 leading-none">Admin Node</h2>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Management Console</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center justify-start transition-all duration-300 group
                  w-full py-3.5 px-4 rounded-2xl gap-4
                  ${isActive 
                    ? 'text-blue-600 bg-blue-50/50' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}

                <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-110'}`}>
                  {item.icon}
                </div>

                <span className={`text-sm font-semibold tracking-normal
                  ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                  {item.label}
                </span>
                
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={16} className={isActive ? 'text-blue-400' : 'text-gray-300'} />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-4 text-gray-500 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-red-50 group"
          >
            <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-red-100/50 transition-colors">
              <LogOut size={18} />
            </div>
            <span className="text-sm font-bold tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE HEADER BAR (Visible on mobile) --- */}
      <div className="lg:hidden fixed z-[500] top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        
        {/* Mobile Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 rounded-xl">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Admin Console</h2>
            <p className="text-[8px] text-blue-600 font-bold uppercase tracking-widest">Mobile View</p>
          </div>
        </div>

        {/* Three-bar Hamburger Menu */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X size={20} className="text-gray-700" />
          ) : (
            <Menu size={20} className="text-gray-700" />
          )}
        </button>
      </div>

      {/* --- MOBILE SIDEBAR OVERLAY (Slide-in from right) --- */}
      <div className={`lg:hidden fixed inset-0 z-[499] transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Slide-in Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Mobile Panel Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Navigation Menu</h3>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                      : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {React.cloneElement(item.icon, {
                      className: isActive ? 'text-blue-600' : 'text-gray-500'
                    })}
                  </div>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 p-4 text-red-600 hover:text-white hover:bg-red-600 transition-all duration-300 rounded-xl border border-red-200"
            >
              <LogOut size={18} />
              <span className="font-bold">Logout from Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION BAR (Sticks to bottom, no rounded corners) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[500] bg-white border-t border-gray-200 shadow-lg">
        <nav className="flex items-center justify-around px-1 py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center p-2 transition-all duration-200 flex-1 min-w-0
                  ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <div className={`p-1.5 ${isActive ? 'bg-blue-50 rounded-lg' : ''}`}>
                  {React.cloneElement(item.icon, {
                    size: 20,
                    className: isActive ? 'text-blue-600' : 'text-gray-500'
                  })}
                </div>
                <span className="text-[10px] font-medium mt-1 truncate w-full text-center">
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1" />
                )}
              </button>
            );
          })}
          
          {/* Mobile Logout in Bottom Nav */}
          <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center p-2 flex-1 min-w-0 text-red-500 hover:text-red-600 transition-colors"
          >
            <div className="p-1.5">
              <LogOut size={20} />
            </div>
            <span className="text-[10px] font-medium mt-1 truncate w-full text-center">
              Logout
            </span>
          </button>
        </nav>
      </div>

      {/* Remove the floating action button since we now have bottom nav */}
    </>
  );
};

export default AdminNavbar;