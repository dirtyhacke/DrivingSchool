import React, { useState, useEffect } from 'react';
import { 
  Search, Trash2, Loader2, User as UserIcon, 
  MapPin, Calendar, ShieldAlert, AlertTriangle,
  ExternalLink, Copy, Check, Smartphone, Clock,
  RefreshCw, X, Info, User, Database, Edit3, Save, PlusCircle, Car, Bike, FileText, CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Embedded Student Editor Component
const EmbeddedStudentEditor = ({ studentData, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studentRegistry, setStudentRegistry] = useState(null);
  
  // State for editable fields
  const [formData, setFormData] = useState({
    // Personal Info (from User model)
    studentName: '',
    phone: '',
    dob: '',
    
    // Registry Info (from StudentRegistry model)
    applicationNumber: '',
    category: 'four-wheeler',
    status: 'active',
    
    // Test Dates
    llDate: '',
    dlDate: '',
    validity: '',
    
    // Financials (from Payment model)
    feePaid: 0,
    totalFee: 0,
    balance: 0,
    
    // Sessions (from StudentRegistry model)
    sessions: []
  });

  const categories = ["four-wheeler", "two-wheeler", "heavy-vehicle", "finished"];

  useEffect(() => {
    fetchStudentData(studentData._id);
  }, [studentData._id]);

  // Fetch student data from multiple endpoints if needed
  const fetchStudentData = async (userId) => {
    try {
      setLoading(true);
      console.log('Fetching student data for user ID:', userId);
      
      // Try multiple endpoints to get all data
      const endpoints = [
        `/api/students/full-registry`, // This might have all data
        `/api/students/registry/${userId}`,
        `/api/students/my-data/${userId}`
      ];
      
      let allData = null;
      
      // Try the full registry endpoint first
      try {
        const response = await fetch('https://drivingschool-9b6b.onrender.com/api/students/full-registry');
        if (response.ok) {
          const data = await response.json();
          console.log('Full registry data:', data);
          
          // Find the specific student in the full registry
          if (Array.isArray(data)) {
            const studentRecord = data.find(item => item._id === userId || item.userId === userId);
            if (studentRecord) {
              allData = studentRecord;
              console.log('Found student in full registry:', studentRecord);
            }
          }
        }
      } catch (error) {
        console.log('Full registry endpoint not available:', error);
      }
      
      // If full registry didn't work, try specific endpoints
      if (!allData) {
        try {
          const response = await fetch(`https://drivingschool-9b6b.onrender.com/api/students/registry/${userId}`);
          if (response.ok) {
            const data = await response.json();
            console.log('Registry response:', data);
            allData = data;
          }
        } catch (error) {
          console.log('Registry endpoint error:', error);
        }
      }
      
      // Format the data
      if (allData) {
        await formatAndSetData(allData);
      } else {
        // Create empty registry if none exists
        createEmptyRegistry();
      }
      
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch student data');
      createEmptyRegistry();
    } finally {
      setLoading(false);
    }
  };

  const formatAndSetData = (data) => {
    console.log('Raw data to format:', data);
    
    // Extract data from different possible structures
    const userData = data.user || studentData;
    const registryData = data.registry || data.studentRegistry || data;
    const paymentData = data.payment || data;
    
    const formattedData = {
      // Personal Info from User model
      studentName: userData.fullName || studentData.fullName || '',
      phone: userData.phoneNumber || studentData.phoneNumber || '',
      dob: formatDateForInput(userData.dob || studentData.dob),
      
      // Registry Info
      applicationNumber: registryData.appNumber || registryData.applicationNumber || `APP-${Date.now().toString().slice(-6)}`,
      category: registryData.vehicleCategory || registryData.category || 'four-wheeler',
      status: registryData.status || 'active',
      
      // Test Dates
      llDate: formatDateForInput(registryData.llDate),
      dlDate: formatDateForInput(registryData.dlDate),
      validity: formatDateForInput(registryData.validity),
      
      // Financials
      feePaid: Number(paymentData.paidAmount || paymentData.feePaid || 0),
      totalFee: Number(paymentData.totalFee || paymentData.totalAmount || 
                     (Number(paymentData.paidAmount || 0) + Number(paymentData.remainingAmount || 0)) || 0),
      balance: Number(paymentData.remainingAmount || paymentData.balance || 0),
      
      // Sessions
      sessions: Array.isArray(registryData.sessions) ? registryData.sessions.map(s => ({
        _id: s._id,
        date: s.date ? formatDateForInput(s.date) : new Date().toISOString().split('T')[0],
        ground: Number(s.ground) || 0,
        simulation: Number(s.simulation) || 0,
        road: Number(s.road) || 0,
        vehicleType: s.vehicleType || registryData.vehicleCategory || 'four-wheeler'
      })) : []
    };
    
    console.log('Formatted data:', formattedData);
    setFormData(formattedData);
    setStudentRegistry(registryData);
  };

  const createEmptyRegistry = () => {
    const emptyData = {
      studentName: studentData.fullName || '',
      phone: studentData.phoneNumber || '',
      dob: studentData.dob ? formatDateForInput(studentData.dob) : '2000-01-01',
      
      applicationNumber: `APP-${Date.now().toString().slice(-6)}`,
      category: 'four-wheeler',
      status: 'active',
      
      llDate: '',
      dlDate: '',
      validity: '',
      
      feePaid: 0,
      totalFee: 0,
      balance: 0,
      
      sessions: []
    };
    
    console.log('Created empty registry:', emptyData);
    setFormData(emptyData);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate balance when fee changes
      if (field === 'totalFee' || field === 'feePaid') {
        const total = field === 'totalFee' ? Number(value) : prev.totalFee;
        const paid = field === 'feePaid' ? Number(value) : prev.feePaid;
        updated.balance = Math.max(0, total - paid);
      }
      
      return updated;
    });
  };

  const handleSessionChange = (index, field, value) => {
    setFormData(prev => {
      const newSessions = [...prev.sessions];
      newSessions[index] = {
        ...newSessions[index],
        [field]: field === 'date' ? value : Number(value) || 0,
        vehicleType: newSessions[index].vehicleType || prev.category
      };
      return { ...prev, sessions: newSessions };
    });
  };

  const addSession = () => {
    const newSession = {
      date: new Date().toISOString().split('T')[0],
      ground: 0,
      simulation: 0,
      road: 0,
      vehicleType: formData.category
    };
    setFormData(prev => ({
      ...prev,
      sessions: [...prev.sessions, newSession]
    }));
  };

  const removeSession = (index) => {
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions.filter((_, i) => i !== index)
    }));
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      
      const saveData = {
        id: studentData._id, // User ID
        studentName: formData.studentName,
        phone: formData.phone,
        dob: formData.dob || null,
        appNumber: formData.applicationNumber,
        llDate: formData.llDate || null,
        dlDate: formData.dlDate || null,
        validity: formData.validity || null,
        feePaid: Number(formData.feePaid) || 0,
        balance: formData.balance || 0,
        category: formData.category,
        status: formData.status,
        sessions: formData.sessions.map(session => ({
          date: session.date,
          ground: Number(session.ground) || 0,
          simulation: Number(session.simulation) || 0,
          road: Number(session.road) || 0,
          vehicleType: session.vehicleType || formData.category
        }))
      };

      console.log('Saving data to backend:', saveData);

      const response = await fetch('https://drivingschool-9b6b.onrender.com/api/students/update-registry', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(saveData)
      });

      const result = await response.json();
      console.log('Save response:', result);
      
      if (response.ok) {
        toast.success('Student registry updated successfully!');
        // Refresh the data
        fetchStudentData(studentData._id);
      } else {
        throw new Error(result.error || result.message || 'Update failed');
      }
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={32} />
        <span className="text-xs text-slate-400">Loading student registry data...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white border-b border-white/10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Database className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">
                STUDENT REGISTRY EDITOR
              </h3>
              <p className="text-xs text-blue-300 mt-1">{studentData.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <FileText size={10} /> Application
            </div>
            <input
              type="text"
              value={formData.applicationNumber}
              onChange={(e) => handleFieldChange('applicationNumber', e.target.value)}
              className="w-full bg-transparent text-white font-bold text-sm border-none outline-none placeholder:text-slate-500"
              placeholder="APP-0001"
            />
          </div>
          
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Car size={10} /> Category
            </div>
            <select
              value={formData.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              className="w-full bg-transparent text-white font-bold text-sm border-none outline-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900">
                  {cat.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <CreditCard size={10} /> Total Fee
            </div>
            <div className="flex items-center">
              <span className="text-slate-400 mr-1">₹</span>
              <input
                type="number"
                value={formData.totalFee}
                onChange={(e) => handleFieldChange('totalFee', e.target.value)}
                className="w-full bg-transparent text-white font-bold text-sm border-none outline-none"
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <CreditCard size={10} /> Balance
            </div>
            <div className={`text-white font-bold text-sm ${formData.balance === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              ₹{formData.balance}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserIcon size={16} className="text-blue-400" />
              PERSONAL INFORMATION
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => handleFieldChange('studentName', e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleFieldChange('dob', e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Test Dates */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-blue-400" />
              TEST DATES
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                  LL Date
                </label>
                <input
                  type="date"
                  value={formData.llDate}
                  onChange={(e) => handleFieldChange('llDate', e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                />
                {formData.llDate && (
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(formData.llDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                  DL Date
                </label>
                <input
                  type="date"
                  value={formData.dlDate}
                  onChange={(e) => handleFieldChange('dlDate', e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                />
                {formData.dlDate && (
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(formData.dlDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                  LL Validity
                </label>
                <input
                  type="date"
                  value={formData.validity}
                  onChange={(e) => handleFieldChange('validity', e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-orange-400 font-medium focus:outline-none focus:border-orange-500"
                />
                {formData.validity && (
                  <p className="text-xs text-slate-500 mt-1">
                    Valid until: {new Date(formData.validity).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-emerald-400" />
              FINANCIAL INFORMATION
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                <label className="block text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">
                  Paid Amount
                </label>
                <div className="flex items-center">
                  <span className="text-emerald-400 font-bold mr-2">₹</span>
                  <input
                    type="number"
                    value={formData.feePaid}
                    onChange={(e) => handleFieldChange('feePaid', e.target.value)}
                    className="w-full bg-transparent text-emerald-300 font-bold text-lg border-none outline-none"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-emerald-400/60 mt-1">
                  Amount already paid
                </p>
              </div>
              
              <div className="bg-cyan-500/10 p-4 rounded-xl border border-cyan-500/20">
                <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
                  Total Fee
                </div>
                <div className="flex items-center">
                  <span className="text-cyan-400 font-bold mr-2">₹</span>
                  <span className="text-cyan-300 font-bold text-lg">
                    {formData.totalFee}
                  </span>
                </div>
                <p className="text-xs text-cyan-400/60 mt-1">
                  Complete course fee
                </p>
              </div>
              
              <div className={`p-4 rounded-xl border ${formData.balance === 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                <div className="text-xs font-bold uppercase tracking-wider mb-2">
                  <span className={formData.balance === 0 ? 'text-emerald-400' : 'text-amber-400'}>
                    {formData.balance === 0 ? 'PAID IN FULL' : 'BALANCE DUE'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={`font-bold mr-2 ${formData.balance === 0 ? 'text-emerald-300' : 'text-amber-300'}`}>₹</span>
                  <span className={`font-bold text-lg ${formData.balance === 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {formData.balance}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${formData.balance === 0 ? 'text-emerald-400/60' : 'text-amber-400/60'}`}>
                  {formData.balance === 0 ? 'All payments completed' : 'Pending amount to be paid'}
                </p>
              </div>
            </div>
            
            {/* Status */}
            <div className="mt-4">
              <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                Student Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="active" className="bg-slate-900">Active</option>
                <option value="completed" className="bg-slate-900">Completed</option>
                <option value="discontinued" className="bg-slate-900">Discontinued</option>
                <option value="on_hold" className="bg-slate-900">On Hold</option>
              </select>
            </div>
          </div>

          {/* Sessions */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" />
                TRAINING SESSIONS ({formData.sessions.length})
              </h4>
              <button
                onClick={addSession}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlusCircle size={14} />
                ADD SESSION
              </button>
            </div>
            
            {formData.sessions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Calendar size={32} className="mx-auto mb-2 text-slate-600" />
                <p>No sessions recorded.</p>
                <p className="text-xs mt-1">Click "Add Session" to start tracking training.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className="text-xs text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
                      <th className="pb-3 text-left pl-2">Date</th>
                      <th className="pb-3 text-center">Vehicle Type</th>
                      <th className="pb-3 text-center">Ground</th>
                      <th className="pb-3 text-center">Simulation</th>
                      <th className="pb-3 text-center">Road</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.sessions.map((session, index) => (
                      <tr key={index} className="border-b border-white/10 last:border-0 hover:bg-white/5">
                        <td className="py-3 pl-2">
                          <input
                            type="date"
                            value={session.date}
                            onChange={(e) => handleSessionChange(index, 'date', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="py-3">
                          <select
                            value={session.vehicleType}
                            onChange={(e) => handleSessionChange(index, 'vehicleType', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat} className="bg-slate-900">
                                {cat.replace('-', ' ')}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3">
                          <input
                            type="number"
                            value={session.ground}
                            onChange={(e) => handleSessionChange(index, 'ground', e.target.value)}
                            className="w-16 mx-auto bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-blue-500"
                            min="0"
                            placeholder="0"
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="number"
                            value={session.simulation}
                            onChange={(e) => handleSessionChange(index, 'simulation', e.target.value)}
                            className="w-16 mx-auto bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-blue-400 text-center focus:outline-none focus:border-blue-500"
                            min="0"
                            placeholder="0"
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="number"
                            value={session.road}
                            onChange={(e) => handleSessionChange(index, 'road', e.target.value)}
                            className="w-16 mx-auto bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-emerald-400 text-center focus:outline-none focus:border-emerald-500"
                            min="0"
                            placeholder="0"
                          />
                        </td>
                        <td className="py-3 pr-2 text-right">
                          <button
                            onClick={() => removeSession(index)}
                            className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Session Summary */}
                {formData.sessions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Total Ground</div>
                        <div className="text-lg font-bold text-white">
                          {formData.sessions.reduce((sum, session) => sum + (Number(session.ground) || 0), 0)} hrs
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Total Simulation</div>
                        <div className="text-lg font-bold text-blue-400">
                          {formData.sessions.reduce((sum, session) => sum + (Number(session.simulation) || 0), 0)} hrs
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Total Road</div>
                        <div className="text-lg font-bold text-emerald-400">
                          {formData.sessions.reduce((sum, session) => sum + (Number(session.road) || 0), 0)} hrs
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-6 bg-slate-800/50">
        <div className="flex justify-between items-center">
          <div className="text-xs text-slate-400">
            Last updated: {studentRegistry?.updatedAt ? new Date(studentRegistry.updatedAt).toLocaleString() : 'New registry'}
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-white/20 text-slate-300 text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UsersRegistry = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: "" });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [expandedImg, setExpandedImg] = useState(null);

  useEffect(() => {
    fetchMasterRegistry();
  }, []);

  const fetchMasterRegistry = async () => {
    setIsRefreshing(true);
    setLoading(true);
    
    try {
      const res = await fetch('https://drivingschool-9b6b.onrender.com/api/admin/management/master-registry');
      const data = await res.json();
      if (data.success) setStudents(data.users);
    } catch (err) {
      toast.error("Database connection failed");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const confirmDelete = async () => {
    const id = deleteModal.userId;
    try {
      const res = await fetch(`https://drivingschool-9b6b.onrender.com/api/students/delete/${id}`, { 
        method: 'DELETE' 
      });
      const data = await res.json();
      if (data.success) {
        setStudents(students.filter(s => s._id !== id));
        toast.success(`${deleteModal.userName} purged successfully`);
      }
    } catch (err) {
      toast.error("Critical failure during purge");
    } finally {
      setDeleteModal({ show: false, userId: null, userName: "" });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Email Copied", { icon: '📋', style: { background: '#0f172a', color: '#fff' }});
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen max-h-screen w-full bg-[#05080a] text-slate-200 font-sans overflow-hidden">
      
      {/* --- STICKY HEADER SECTION --- */}
      <div className="flex-none p-6 md:p-8 border-b border-white/5 bg-slate-950/50 backdrop-blur-md z-40">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 max-w-[1600px] mx-auto w-full">
          <div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-1 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Master Registry</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
                   <ShieldAlert size={12} className="text-blue-600"/> Security Level 01 <span className="text-slate-800">|</span> <span className="text-blue-400">{filteredStudents.length} Nodes Active</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search Identity..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
                onClick={fetchMasterRegistry}
                className={`p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${isRefreshing ? 'animate-spin text-blue-500' : 'text-slate-400'}`}
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-[1600px] mx-auto w-full">
            {/* Desktop View */}
            <div className="hidden lg:block">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="sticky top-0 bg-[#05080a] z-30">
                        <tr className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                            <th className="px-8 py-5 border-b border-white/5">Identity Node</th>
                            <th className="px-8 py-5 border-b border-white/5">Contact</th>
                            <th className="px-8 py-5 border-b border-white/5">Location</th>
                            <th className="px-8 py-5 border-b border-white/5">Timestamp</th>
                            <th className="px-8 py-5 border-b border-white/5 text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                            <td colSpan="5" className="py-32 text-center">
                                <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Decrypting Data...</span>
                            </td>
                            </tr>
                        ) : filteredStudents.map((student) => (
                            <DesktopRow 
                                key={student._id} 
                                student={student} 
                                copyToClipboard={copyToClipboard} 
                                setDeleteModal={setDeleteModal} 
                                setSelectedStudent={setSelectedStudent} 
                                setExpandedImg={setExpandedImg}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden p-4 space-y-4 pb-32">
                {loading ? (
                    <div className="py-32 text-center">
                        <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Scanning...</span>
                    </div>
                ) : filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                        <MobileCard 
                            key={student._id} 
                            student={student} 
                            setDeleteModal={setDeleteModal} 
                            setSelectedStudent={setSelectedStudent}
                            setExpandedImg={setExpandedImg}
                        />
                    ))
                ) : (
                    <div className="py-20 text-center text-slate-700 uppercase text-[10px] font-black tracking-widest italic">Zero matches found in database</div>
                )}
            </div>
        </div>
      </div>

      {/* --- FOOTER STATUS BAR --- */}
      <div className="flex-none bg-slate-950 border-t border-white/5 px-6 py-3 flex justify-between items-center z-40">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">System Live</span>
            </div>
            <span className="text-slate-800 font-black">/</span>
            <span className="text-[9px] font-black text-blue-600 uppercase">Buffer: Stable</span>
        </div>
        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic flex items-center gap-2">
            Protocol Version 4.0.2 <div className="w-1 h-1 bg-slate-800 rounded-full"></div> 2024
        </div>
      </div>

      {/* --- STUDENT EDITOR MODAL --- */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-lg" 
              onClick={() => setSelectedStudent(null)}
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-[2010] w-full max-w-6xl h-[90vh] shadow-2xl rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <EmbeddedStudentEditor 
                studentData={selectedStudent} 
                onClose={() => setSelectedStudent(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- IMAGE EXPANSION MODAL --- */}
      <AnimatePresence>
        {expandedImg && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/98 backdrop-blur-2xl p-4"
            onClick={() => setExpandedImg(null)}
          >
            <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-all">
              <X size={40} strokeWidth={1} />
            </button>
            <motion.img 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                src={expandedImg} 
                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-white/10 object-contain" 
                alt="Profile"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" onClick={() => setDeleteModal({show:false})}></div>
          <div className="bg-white rounded-2xl p-10 w-full max-w-sm relative z-[1010] shadow-2xl">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 animate-pulse">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-slate-950 font-black uppercase italic text-2xl text-center tracking-tighter">Authorize Purge?</h3>
            <p className="text-slate-500 text-[11px] mt-4 font-medium text-center leading-relaxed">
              Permanent removal of <span className="font-bold text-slate-900 underline">{deleteModal.userName}</span> from master registry. This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3 mt-8">
              <button onClick={confirmDelete} className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95">Confirm Execution</button>
              <button onClick={() => setDeleteModal({show:false})} className="w-full py-4 rounded-2xl bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">Abort Protocol</button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2563eb; }
      `}</style>
    </div>
  );
};

const DesktopRow = ({ student, copyToClipboard, setDeleteModal, setSelectedStudent, setExpandedImg }) => {
    const dateObj = new Date(student.createdAt);
    
    const handleImageClick = (e) => {
      e.stopPropagation();
      if (student.profileImage) {
        setExpandedImg(student.profileImage);
      }
    };
    
    const handleRowClick = () => {
      setSelectedStudent(student);
    };
    
    return (
    <tr className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={handleRowClick}>
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div 
            onClick={handleImageClick}
            className="w-12 h-12 rounded-2xl overflow-hidden border border-white/5 bg-slate-900 cursor-zoom-in active:scale-90 transition-all shadow-lg flex-shrink-0"
          >
            {student.profileImage ? (
              <img src={student.profileImage} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-700">
                <UserIcon size={20} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-black text-sm text-white uppercase italic tracking-tight hover:text-blue-500 transition-all truncate flex items-center gap-2">
              {student.fullName}
              <Database size={12} className="text-blue-400" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-500 lowercase font-medium truncate">{student.email}</span>
              <button onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(student.email);
              }} className="text-slate-700 hover:text-blue-400 transition-colors flex-shrink-0">
                <Copy size={12} />
              </button>
            </div>
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <a 
          href={`https://wa.me/${student.phoneNumber}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-500 font-black tracking-widest hover:bg-emerald-500/10 transition-all truncate max-w-[180px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
          <span className="truncate">{student.phoneNumber}</span>
        </a>
      </td>
      <td className="px-8 py-5">
        <div className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2 tracking-widest truncate max-w-[150px]">
            <MapPin size={12} className="text-slate-600 flex-shrink-0" />
            <span className="truncate">{student.location}</span>
        </div>
      </td>
      <td className="px-8 py-5">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{dateObj.toLocaleDateString()}</div>
          <div className="text-[9px] text-blue-600 font-black flex items-center gap-1 mt-1 uppercase italic">
            <Clock size={10} /> {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
      </td>
      <td className="px-8 py-5 text-right">
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedStudent(student)} 
              className="p-2.5 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all flex items-center gap-1"
              title="Edit Student Registry"
            >
              <Edit3 size={18} />
              <span className="text-[10px] font-bold hidden lg:inline">Edit</span>
            </button>
            <button 
              onClick={() => setDeleteModal({ show: true, userId: student._id, userName: student.fullName })} 
              className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              title="Delete Student"
            >
              <Trash2 size={18} />
            </button>
        </div>
      </td>
    </tr>
    );
};

const MobileCard = ({ student, setDeleteModal, setSelectedStudent, setExpandedImg }) => {
    const dateObj = new Date(student.createdAt);
    
    const handleImageClick = (e) => {
      e.stopPropagation();
      if (student.profileImage) {
        setExpandedImg(student.profileImage);
      }
    };
    
    const handleCardClick = () => {
      setSelectedStudent(student);
    };
    
    return (
    <div 
      className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl relative overflow-hidden backdrop-blur-sm cursor-pointer hover:bg-white/[0.03] transition-all"
      onClick={handleCardClick}
    >
        <div className="flex items-center gap-4 mb-5">
            <div 
                onClick={handleImageClick}
                className="w-14 h-14 rounded-2xl border border-white/10 overflow-hidden cursor-zoom-in shadow-xl flex-shrink-0"
            >
                {student.profileImage ? (
                  <img src={student.profileImage} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">
                    <UserIcon size={24} />
                  </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-black uppercase text-sm tracking-tight italic truncate">
                    {student.fullName}
                  </h4>
                  <Database size={12} className="text-blue-400 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">{dateObj.toLocaleDateString()}</span>
                    <span className="text-[9px] text-blue-600 font-black uppercase flex items-center gap-1 italic">
                        <Clock size={10} /> {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Region</p>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-500 uppercase italic truncate">
                    <MapPin size={10} /> {student.location}
                </div>
            </div>
            <a 
              href={`https://wa.me/${student.phoneNumber}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
                <p className="text-[7px] font-black text-emerald-500/60 uppercase tracking-[0.2em] mb-1">WhatsApp</p>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-white truncate">
                    <Smartphone size={10} className="text-emerald-500"/> {student.phoneNumber}
                </div>
            </a>
        </div>

        <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStudent(student);
              }}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
            >
                <Edit3 size={14} /> Edit Registry
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModal({ show: true, userId: student._id, userName: student.fullName });
              }} 
              className="p-3 bg-red-500/10 text-red-500 rounded-xl active:scale-90 border border-red-500/20 flex-shrink-0"
            >
                <Trash2 size={16} />
            </button>
        </div>
    </div>
    );
};

export default UsersRegistry;