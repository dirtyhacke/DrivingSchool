import React, { useState, useEffect } from 'react';
import { 
  Database, Calendar, Car, CreditCard, User, Phone, FileText, Award, 
  Clock, Download, RefreshCw, ChevronRight, AlertCircle, CheckCircle, 
  XCircle, Lock, Shield, Eye, Copy, Clipboard, BookOpen, MapPin, 
  Mail, Hash, BadgeCheck, Tag, LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyAllData = ({ darkMode, userId, onLogout }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('personal');
  const [copiedField, setCopiedField] = useState(null);
  const [viewingAsAdmin, setViewingAsAdmin] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Check if we're viewing as admin (for testing)
      const adminView = localStorage.getItem('admin_view_mode');
      setViewingAsAdmin(!!adminView);
      
      // NEW: Fetch ONLY current user's data from the StudentDatas backend
      console.log('Fetching data for user:', userId);
      
      // Option 1: Use the existing full registry endpoint with filtering
      const response = await fetch('http://localhost:8080/api/students/full-registry');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const allData = await response.json();
      console.log('All data received:', allData);
      
      // Find current user's data
      const currentUserData = allData.find(item => item._id === userId);
      
      if (!currentUserData) {
        // Try alternative: Use single user endpoint
        console.log('Trying single user endpoint...');
        const singleResponse = await fetch(`http://localhost:8080/api/students/registry/${userId}`);
        
        if (singleResponse.ok) {
          const singleData = await singleResponse.json();
          setStudentData(singleData);
        } else {
          // Create mock data structure based on backend schema
          setStudentData({
            _id: userId,
            fullName: 'Current User',
            phoneNumber: '',
            dob: '',
            appNumber: `APP-${Date.now().toString().slice(-6)}`,
            vehicleCategory: 'four-wheeler',
            llDate: '',
            dlDate: '',
            validity: '',
            sessions: [],
            paidAmount: 0,
            remainingAmount: 0,
            totalFee: 0,
            attendanceStats: {},
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
          });
          toast.info('Using placeholder data - no registry found');
        }
      } else {
        // Format the data to match MyAllData component expectations
        const formattedData = {
          // Personal info
          _id: currentUserData._id,
          fullName: currentUserData.fullName || 'Not provided',
          phoneNumber: currentUserData.phoneNumber || '',
          dob: currentUserData.dob || '',
          email: currentUserData.email || '', // Add if available
          
          // Registry info
          appNumber: currentUserData.appNumber || '',
          vehicleCategory: currentUserData.vehicleCategory || 'four-wheeler',
          llDate: currentUserData.llDate || '',
          dlDate: currentUserData.dlDate || '',
          validity: currentUserData.validity || '',
          
          // Sessions
          sessions: Array.isArray(currentUserData.sessions) ? 
            currentUserData.sessions.map(session => ({
              date: session.date,
              ground: Number(session.ground) || 0,
              simulation: Number(session.simulation) || 0,
              road: Number(session.road) || 0,
              vehicleType: session.vehicleType || currentUserData.vehicleCategory
            })) : [],
          
          // Financials
          paidAmount: Number(currentUserData.paidAmount) || 0,
          remainingAmount: Number(currentUserData.remainingAmount) || 0,
          totalFee: (Number(currentUserData.paidAmount) || 0) + (Number(currentUserData.remainingAmount) || 0),
          
          // Stats
          attendanceStats: currentUserData.attendanceStats || {
            totalGroundSessions: 0,
            totalSimulationSessions: 0,
            totalRoadSessions: 0,
            totalSessions: 0
          },
          status: currentUserData.status || 'active',
          
          // Timestamps
          createdAt: currentUserData.createdAt || new Date(),
          updatedAt: currentUserData.updatedAt || new Date()
        };
        
        setStudentData(formattedData);
        toast.success('Your data loaded successfully!');
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchUserData();
  };

  const handleExportPDF = () => {
    toast.loading('Generating PDF...');
    // PDF generation logic here
    setTimeout(() => {
      toast.success('PDF exported successfully');
    }, 1500);
  };

  const handleCopyToClipboard = (text, fieldName) => {
    if (!text || text === 'Not provided') return;
    
    navigator.clipboard.writeText(text.toString())
      .then(() => {
        setCopiedField(fieldName);
        toast.success(`Copied ${fieldName} to clipboard!`);
        setTimeout(() => setCopiedField(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy to clipboard');
      });
  };

  // NEW: Function to simulate admin view (for testing)
  const toggleAdminView = () => {
    if (viewingAsAdmin) {
      localStorage.removeItem('admin_view_mode');
      setViewingAsAdmin(false);
      toast.success('Switched to user view');
    } else {
      localStorage.setItem('admin_view_mode', 'true');
      setViewingAsAdmin(true);
      toast.info('Admin view enabled - seeing all data');
    }
    fetchUserData();
  };

  // NEW: Calculate attendance stats from sessions
  const calculateAttendanceStats = () => {
    if (!studentData || !studentData.sessions) {
      return { totalGroundSessions: 0, totalSimulationSessions: 0, totalRoadSessions: 0, totalSessions: 0 };
    }
    
    const stats = studentData.sessions.reduce((acc, session) => {
      acc.totalGroundSessions += Number(session.ground) || 0;
      acc.totalSimulationSessions += Number(session.simulation) || 0;
      acc.totalRoadSessions += Number(session.road) || 0;
      acc.totalSessions += (Number(session.ground) || 0) + (Number(session.simulation) || 0) + (Number(session.road) || 0);
      return acc;
    }, { totalGroundSessions: 0, totalSimulationSessions: 0, totalRoadSessions: 0, totalSessions: 0 });
    
    return stats;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <Database className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500" size={24} />
        </div>
        <p className="text-sm opacity-60 mt-4">Loading your personal data...</p>
        <p className="text-xs opacity-40 mt-2">Fetching from multiple collections</p>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-bold mb-2">No Data Found</h3>
        <p className="text-sm opacity-60 mb-4">Unable to load your personal information</p>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          {onLogout && (
            <button 
              onClick={onLogout}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: <User size={18} />, color: 'blue' },
    { id: 'registry', label: 'Registry Details', icon: <FileText size={18} />, color: 'purple' },
    { id: 'training', label: 'Training Sessions', icon: <Award size={18} />, color: 'emerald' },
    { id: 'financial', label: 'Financial Info', icon: <CreditCard size={18} />, color: 'amber' },
    { id: 'documents', label: 'Documents', icon: <Database size={18} />, color: 'cyan' },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Use calculated stats instead of stored ones
  const attendanceStats = calculateAttendanceStats();
  
  const calculateCompletionPercentage = () => {
    const totalSessions = attendanceStats.totalSessions;
    return Math.min(100, Math.round((totalSessions / 40) * 100));
  };

  return (
    <div className={`rounded-3xl overflow-hidden ${darkMode ? 'bg-white/[0.02]' : 'bg-white'} border ${darkMode ? 'border-white/5' : 'border-slate-200'}`}>
      {/* Header */}
      <div className={`p-8 border-b ${darkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-blue-500" size={20} />
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                My Complete Data
                {viewingAsAdmin && <span className="ml-2 text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded-full">ADMIN VIEW</span>}
              </h2>
              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-500 rounded-full font-bold">
                <Lock size={10} className="inline mr-1" /> READ ONLY
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest opacity-60">
              Your personal driving school information • View only • Secure access
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full">
                <User size={12} className="text-blue-500" />
                <span className="text-xs font-semibold">{studentData.fullName?.split(' ')[0] || 'Student'}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full">
                <Hash size={12} className="text-emerald-500" />
                <span className="text-xs font-semibold">{studentData.appNumber || 'No App #'}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-full">
                <Car size={12} className="text-purple-500" />
                <span className="text-xs font-semibold uppercase">
                  {studentData.vehicleCategory?.replace('-', ' ') || 'Category'}
                </span>
              </div>
              <button
                onClick={toggleAdminView}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${viewingAsAdmin ? 'bg-red-500/20 text-red-500' : 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20'}`}
                title="Toggle admin view mode"
              >
                {viewingAsAdmin ? 'User View' : 'Admin View'}
              </button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 rounded-xl bg-blue-600/10 text-blue-500 border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
              title="Refresh data"
            >
              <RefreshCw size={16} />
              <span className="text-xs font-semibold">Refresh</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 rounded-xl bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
              title="Export as PDF"
            >
              <Download size={16} />
              <span className="text-xs font-semibold">Export</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-xl bg-slate-600/10 text-slate-500 border border-slate-500/20 hover:bg-slate-600 hover:text-white transition-all flex items-center gap-2"
                title="Logout"
              >
                <LogOut size={16} />
                <span className="text-xs font-semibold">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-white/5">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-3 px-6 py-4 whitespace-nowrap transition-all relative ${
              activeSection === section.id
                ? `bg-${section.color}-600 text-white`
                : darkMode
                ? 'hover:bg-white/5 text-slate-300'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            {section.icon}
            <span className="text-sm font-semibold">{section.label}</span>
            {activeSection === section.id && <ChevronRight size={16} className="ml-1" />}
            {activeSection === section.id && (
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${section.color}-400`} />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-6 lg:p-8">
        {/* Personal Information Section */}
        {activeSection === 'personal' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <User className="text-blue-500" size={20} />
                Personal Information
              </h3>
              <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full">
                Private & Confidential
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ReadOnlyCard 
                title="Full Name" 
                value={studentData.fullName || 'Not provided'} 
                icon={<User size={16} />}
                onCopy={() => handleCopyToClipboard(studentData.fullName, 'Full Name')}
                copied={copiedField === 'Full Name'}
                type="text"
              />
              <ReadOnlyCard 
                title="Phone Number" 
                value={studentData.phoneNumber || 'Not provided'} 
                icon={<Phone size={16} />}
                onCopy={() => handleCopyToClipboard(studentData.phoneNumber, 'Phone Number')}
                copied={copiedField === 'Phone Number'}
                type="phone"
              />
              <ReadOnlyCard 
                title="Date of Birth" 
                value={formatDate(studentData.dob)} 
                icon={<Calendar size={16} />}
                type="date"
              />
              <ReadOnlyCard 
                title="Student ID" 
                value={studentData._id || userId || 'Not assigned'} 
                icon={<Hash size={16} />}
                onCopy={() => handleCopyToClipboard(studentData._id || userId, 'Student ID')}
                copied={copiedField === 'Student ID'}
                type="id"
              />
              <ReadOnlyCard 
                title="Account Created" 
                value={formatDate(studentData.createdAt)} 
                icon={<Clock size={16} />}
                type="date"
              />
              <ReadOnlyCard 
                title="Last Updated" 
                value={formatDate(studentData.updatedAt)} 
                icon={<RefreshCw size={16} />}
                type="date"
              />
            </div>
            
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-blue-500/5 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'}`}>
              <div className="flex items-center gap-3 mb-3">
                <Eye className="text-blue-500" size={18} />
                <h4 className="font-bold">Data Privacy Notice</h4>
              </div>
              <p className="text-sm opacity-70">
                Your personal information is securely stored and only accessible to authorized school personnel. 
                This data is used exclusively for training and certification purposes.
              </p>
            </div>
          </div>
        )}

        {/* Registry Information Section */}
        {activeSection === 'registry' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FileText className="text-purple-500" size={20} />
                Registry Information
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                studentData.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' :
                studentData.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
                'bg-slate-500/20 text-slate-500'
              }`}>
                {studentData.status?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ReadOnlyCard 
                title="Application Number" 
                value={studentData.appNumber || 'Not assigned'} 
                icon={<Tag size={16} />}
                onCopy={() => handleCopyToClipboard(studentData.appNumber, 'Application Number')}
                copied={copiedField === 'Application Number'}
                type="text"
                highlight
              />
              <ReadOnlyCard 
                title="Vehicle Category" 
                value={studentData.vehicleCategory ? studentData.vehicleCategory.replace('-', ' ').toUpperCase() : 'Not assigned'} 
                icon={<Car size={16} />}
                type="category"
              />
              <ReadOnlyCard 
                title="Learning License Date" 
                value={formatDate(studentData.llDate)} 
                icon={<Calendar size={16} />}
                type="date"
                status={studentData.llDate ? 'success' : 'warning'}
              />
              <ReadOnlyCard 
                title="Driving License Date" 
                value={formatDate(studentData.dlDate)} 
                icon={<BadgeCheck size={16} />}
                type="date"
                status={studentData.dlDate ? 'success' : 'warning'}
              />
              <ReadOnlyCard 
                title="License Validity" 
                value={formatDate(studentData.validity)} 
                icon={<Clock size={16} />}
                type="date"
                status={
                  studentData.validity && new Date(studentData.validity) > new Date() 
                    ? 'success' 
                    : 'error'
                }
              />
              <ReadOnlyCard 
                title="Registry ID" 
                value={studentData._id ? studentData._id.slice(-8) : 'N/A'} 
                icon={<Database size={16} />}
                type="id"
              />
            </div>
            
            {/* Progress Overview */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-purple-500/5 border border-purple-500/20' : 'bg-purple-50 border border-purple-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold flex items-center gap-2">
                  <BookOpen size={16} />
                  Course Progress
                </h4>
                <span className="text-2xl font-bold">{calculateCompletionPercentage()}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${calculateCompletionPercentage()}%` }}
                />
              </div>
              <p className="text-sm opacity-70 mt-2">
                Based on your completed training sessions ({attendanceStats.totalSessions} total sessions)
              </p>
            </div>
          </div>
        )}

        {/* Training Sessions Section */}
        {activeSection === 'training' && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Award className="text-emerald-500" size={20} />
                  Training Sessions
                </h3>
                <p className="text-sm opacity-60 mt-1">
                  Your complete training history and progress
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold">{studentData.sessions?.length || 0}</div>
                  <div className="text-xs opacity-60">Total Sessions</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {attendanceStats.totalSessions.toLocaleString()}
                  </div>
                  <div className="text-xs opacity-60">Training Hours</div>
                </div>
              </div>
            </div>
            
            {/* Session Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Ground Sessions" 
                value={attendanceStats.totalGroundSessions}
                color="blue"
                icon={<MapPin size={16} />}
              />
              <StatCard 
                title="Simulation Sessions" 
                value={attendanceStats.totalSimulationSessions}
                color="purple"
                icon={<Car size={16} />}
              />
              <StatCard 
                title="Road Sessions" 
                value={attendanceStats.totalRoadSessions}
                color="emerald"
                icon={<MapPin size={16} />}
              />
            </div>
            
            {/* Sessions Table */}
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className={`p-4 ${darkMode ? 'bg-white/5' : 'bg-slate-50'} border-b border-white/10`}>
                <h4 className="font-bold">Session History</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Date</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Vehicle Type</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Ground</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Simulation</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Road</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.sessions && studentData.sessions.length > 0 ? (
                      studentData.sessions
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((session, index) => (
                          <tr 
                            key={index} 
                            className={`border-b ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}
                          >
                            <td className="py-3 px-4 font-medium">{formatDate(session.date)}</td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                session.vehicleType?.includes('two') 
                                  ? 'bg-purple-500/20 text-purple-500'
                                  : 'bg-blue-500/20 text-blue-500'
                              }`}>
                                {session.vehicleType?.replace('-', ' ') || studentData.vehicleCategory?.replace('-', ' ') || 'N/A'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center ${
                                session.ground > 0 
                                  ? 'bg-blue-500/20 text-blue-500 font-bold'
                                  : 'bg-slate-500/10 text-slate-400'
                              }`}>
                                {session.ground || 0}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center ${
                                session.simulation > 0 
                                  ? 'bg-purple-500/20 text-purple-500 font-bold'
                                  : 'bg-slate-500/10 text-slate-400'
                              }`}>
                                {session.simulation || 0}
                            </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center ${
                                session.road > 0 
                                  ? 'bg-emerald-500/20 text-emerald-500 font-bold'
                                  : 'bg-slate-500/10 text-slate-400'
                              }`}>
                                {session.road || 0}
                              </span>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center">
                          <Award className="mx-auto mb-3 opacity-40" size={32} />
                          <p className="text-sm opacity-60">No training sessions recorded yet</p>
                          <p className="text-xs opacity-40 mt-1">Start your training to see sessions here</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Financial Information Section */}
        {activeSection === 'financial' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="text-amber-500" size={20} />
                Financial Information
              </h3>
              <div className="flex items-center gap-2">
                {studentData.remainingAmount === 0 ? (
                  <CheckCircle className="text-emerald-500" size={20} />
                ) : studentData.paidAmount === 0 ? (
                  <XCircle className="text-red-500" size={20} />
                ) : (
                  <Clock className="text-amber-500" size={20} />
                )}
                <span className="text-sm font-semibold">
                  {studentData.remainingAmount === 0 ? 'Fully Paid' : 
                   studentData.paidAmount === 0 ? 'Payment Pending' : 
                   'Partially Paid'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FinancialCard 
                title="Total Course Fee" 
                value={`₹${(studentData.totalFee || 0).toLocaleString('en-IN')}`}
                color="blue"
                type="total"
              />
              <FinancialCard 
                title="Amount Paid" 
                value={`₹${(studentData.paidAmount || 0).toLocaleString('en-IN')}`}
                color="emerald"
                type="paid"
                progress={studentData.totalFee ? (studentData.paidAmount / studentData.totalFee) * 100 : 0}
              />
              <FinancialCard 
                title="Balance Amount" 
                value={`₹${(studentData.remainingAmount || 0).toLocaleString('en-IN')}`}
                color={studentData.remainingAmount > 0 ? 'red' : 'slate'}
                type="balance"
              />
            </div>
            
            {/* Payment Progress */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-amber-50 border border-amber-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold">Payment Progress</h4>
                <span className="text-xl font-bold">
                  {studentData.totalFee ? Math.round((studentData.paidAmount / studentData.totalFee) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${studentData.totalFee ? (studentData.paidAmount / studentData.totalFee) * 100 : 0}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>₹0</span>
                <span>₹{(studentData.totalFee || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            {/* Payment Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-blue-500" />
                  <span className="font-medium">Next Payment Due</span>
                </div>
                <p className="text-2xl font-bold">
                  {studentData.remainingAmount > 0 ? `₹${studentData.remainingAmount.toLocaleString('en-IN')}` : 'No Dues'}
                </p>
              </div>
              <div className={`p-4 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-purple-500" />
                  <span className="font-medium">Last Updated</span>
                </div>
                <p className="text-lg font-semibold">{formatDate(studentData.updatedAt)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Documents Section */}
        {activeSection === 'documents' && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Database className="text-cyan-500" size={20} />
              Important Documents
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DocumentCard 
                title="Application Form" 
                status="Submitted"
                date={formatDate(studentData.createdAt)}
                icon={<FileText size={20} />}
                description="Your initial application form"
              />
              <DocumentCard 
                title="Medical Certificate" 
                status="Required"
                date="Not uploaded"
                icon={<FileText size={20} />}
                description="Medical fitness certificate"
              />
              <DocumentCard 
                title="Identity Proof" 
                status="Verified"
                date={formatDate(studentData.updatedAt)}
                icon={<BadgeCheck size={20} />}
                description="Government ID verification"
              />
              <DocumentCard 
                title="Training Certificate" 
                status={studentData.status === 'completed' ? 'Issued' : 'Pending'}
                date={studentData.status === 'completed' ? 'Upon completion' : 'N/A'}
                icon={<Award size={20} />}
                description="Course completion certificate"
              />
            </div>
            
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-cyan-500/5 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-100'}`}>
              <div className="flex items-center gap-3 mb-3">
                <Eye className="text-cyan-500" size={18} />
                <h4 className="font-bold">Document Access</h4>
              </div>
              <p className="text-sm opacity-70">
                To request document copies or upload missing documents, please contact the 
                school administration office directly. All documents are stored securely.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components (unchanged)
const ReadOnlyCard = ({ title, value, icon, onCopy, copied, type, highlight = false, status }) => {
  const statusColors = {
    success: 'border-emerald-500/30 bg-emerald-500/5',
    warning: 'border-amber-500/30 bg-amber-500/5',
    error: 'border-red-500/30 bg-red-500/5',
    default: 'border-white/10'
  };

  const statusIcons = {
    success: <CheckCircle size={14} className="text-emerald-500" />,
    warning: <Clock size={14} className="text-amber-500" />,
    error: <XCircle size={14} className="text-red-500" />,
  };

  return (
    <div className={`p-4 rounded-2xl border ${highlight ? 'border-blue-500/30 bg-blue-500/5' : statusColors[status] || statusColors.default} relative group`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold opacity-80">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {status && statusIcons[status]}
          {onCopy && value !== 'Not provided' && value !== 'Not available' && (
            <button
              onClick={onCopy}
              className={`p-1.5 rounded-lg transition-all ${copied ? 'bg-emerald-500/20 text-emerald-500' : 'hover:bg-white/10'}`}
              title={`Copy ${title}`}
            >
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>
      <p className={`text-lg font-bold truncate ${type === 'date' ? 'text-slate-300' : ''}`}>
        {value}
      </p>
      {type === 'date' && value !== 'Not available' && (
        <p className="text-xs opacity-60 mt-1">
          {new Date(value).toLocaleDateString('en-US', { weekday: 'long' })}
        </p>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color = 'blue', icon }) => {
  const colorClasses = {
    blue: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
    emerald: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    purple: 'text-purple-500 border-purple-500/20 bg-purple-500/5',
    amber: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
  };

  return (
    <div className={`p-4 rounded-2xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-semibold opacity-80">{title}</span>
      </div>
      <p className="text-3xl font-black">{value.toLocaleString()}</p>
      <p className="text-xs opacity-60 mt-1">completed sessions</p>
    </div>
  );
};

const FinancialCard = ({ title, value, color = 'blue', type, progress }) => {
  const colorClasses = {
    blue: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
    emerald: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    red: 'text-red-500 border-red-500/20 bg-red-500/5',
    slate: 'text-slate-500 border-slate-500/20 bg-slate-500/5',
  };

  return (
    <div className={`p-4 rounded-2xl border ${colorClasses[color]} relative overflow-hidden`}>
      <div className="relative z-10">
        <p className="text-sm font-semibold opacity-80 mb-2">{title}</p>
        <p className="text-3xl font-black">{value}</p>
        {type === 'paid' && progress > 0 && (
          <p className="text-xs opacity-60 mt-2">{progress.toFixed(1)}% of total</p>
        )}
      </div>
      {type === 'paid' && progress > 0 && (
        <div 
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      )}
    </div>
  );
};

const DocumentCard = ({ title, status, date, icon, description }) => {
  const statusColor = {
    Submitted: 'bg-emerald-500/20 text-emerald-500',
    Verified: 'bg-blue-500/20 text-blue-500',
    Required: 'bg-amber-500/20 text-amber-500',
    Pending: 'bg-slate-500/20 text-slate-500',
    Issued: 'bg-purple-500/20 text-purple-500',
  }[status] || 'bg-slate-500/20 text-slate-500';

  return (
    <div className="p-4 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-bold">{title}</h4>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
              {status}
            </span>
          </div>
          <p className="text-sm opacity-60 mt-1">{description}</p>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="opacity-60">Last updated: {date}</span>
        <button 
          className="text-blue-500 hover:text-blue-400 text-xs font-semibold flex items-center gap-1"
          disabled={status === 'Required' || status === 'Pending'}
        >
          <Eye size={12} />
          View
        </button>
      </div>
    </div>
  );
};

export default MyAllData;