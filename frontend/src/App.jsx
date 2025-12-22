// App.jsx
import React, { useState } from 'react';
import Home from './pages/Home';
import UserLogin from './components/UserLogin';
import AdminLogin from './components/AdminLogin';
import MVahanPortal from './components/MVahanPortal'; // 1. Import the new component
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [view, setView] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Show Home Page */}
      {view === 'home' && (
        <Home onNavigate={(target) => setView(target)} />
      )}
      
      {/* 2. ADD THIS: Show mVahan Portal */}
      {view === 'mvahan' && (
        <MVahanPortal onBack={() => setView('home')} />
      )}
      
      {/* Show User Login Page */}
      {view === 'user-login' && (
        <UserLogin onBack={() => setView('home')} />
      )}
      
      {/* Show Admin Login Page */}
      {view === 'admin-login' && (
        <AdminLogin onBack={() => setView('home')} />
      )}
    </div>
  );
};

export default App;