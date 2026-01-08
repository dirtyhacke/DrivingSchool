import React, { useState, useEffect, useCallback } from 'react';
import { Database, Trash2, Save, RefreshCw, PlusCircle, Car, Bike, X, Download, Search, Clock, User, Phone, Calendar, CreditCard, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDatas = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bulkSelect, setBulkSelect] = useState([]);
  const [savingStudents, setSavingStudents] = useState({});

  // Sync these exactly with your DB Enum/Schema
  const categories = ["four-wheeler", "two-wheeler", "heavy-vehicle", "finished"];

  // Skeleton loading array
  const skeletonStudents = Array(5).fill({});

  // Helper function to format date to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return '';
    }
  };

  // Memoize fetch function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('Fetching data from API...');
      const response = await fetch('http://localhost:8080/api/students/full-registry');
      
      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const dbData = await response.json();
      console.log('Raw API Response:', dbData);

      if (dbData && Array.isArray(dbData)) {
        const formatted = dbData.map((item, index) => {
          console.log(`Processing student ${index}:`, item.fullName, 'Sessions:', item.sessions);
          
          // Format sessions from the new schema
          const sessions = Array.isArray(item.sessions) ? item.sessions.map(session => {
            return {
              _id: session._id,
              date: session.date ? formatDateForInput(session.date) : new Date().toISOString().split('T')[0],
              ground: Number(session.ground) || 0,
              simulation: Number(session.simulation) || 0,
              road: Number(session.road) || 0,
              vehicleType: session.vehicleType || item.vehicleCategory || "four-wheeler"
            };
          }) : [];

          return {
            // Personal info (from User/Profile models)
            id: item._id,
            studentName: item.fullName || '',
            phone: item.phoneNumber || '',
            dob: item.dob ? formatDateForInput(item.dob) : "2000-01-01",
            
            // Registry info (from StudentRegistry model)
            registryId: item.registryId || null,
            applicationNumber: item.appNumber || `AP-2026${String(index).padStart(3, '0')}`,
            category: item.vehicleCategory || "four-wheeler",
            
            // Test dates and validity (from StudentRegistry model)
            llDate: formatDateForInput(item.llDate),
            dlDate: formatDateForInput(item.dlDate),
            validity: formatDateForInput(item.validity),
            
            // Sessions (from StudentRegistry model)
            sessions: sessions,
            
            // Financials (from Payment model - display only)
            feePaid: Number(item.paidAmount) || 0,
            totalFee: (Number(item.paidAmount) || 0) + (Number(item.remainingAmount) || 0),
            balance: Number(item.remainingAmount) || 0,
            
            // Stats (from StudentRegistry model)
            attendanceStats: item.attendanceStats || {},
            status: item.status || 'active',
            
            // Timestamps
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString()
          };
        });
        
        console.log('Formatted students:', formatted);
        
        setStudents(formatted);
        
        // Count sessions for toast
        const totalSessions = formatted.reduce((acc, student) => acc + student.sessions.length, 0);
        const activeStudents = formatted.filter(s => s.status === 'active').length;
        
        toast.success(`Loaded ${formatted.length} students (${activeStudents} active) with ${totalSessions} sessions`);
        setLoading(false);
      } else {
        console.error('Invalid data format:', dbData);
        toast.error("Invalid data format received from server");
        setLoading(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(`Database connection failed: ${error.message}`);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle manual refresh
  const handleManualRefresh = () => {
    fetchData();
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'all' || student.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle personal info changes (User/Profile models)
  const handlePersonalInfoChange = (id, field, value) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return { 
          ...s, 
          [field]: value,
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    }));
  };

  // Handle registry info changes (StudentRegistry model)
  const handleRegistryInfoChange = (id, field, value) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { 
          ...s, 
          [field]: value,
          updatedAt: new Date().toISOString()
        };
        
        // Auto-update balance when totalFee or feePaid changes
        if (field === 'totalFee' || field === 'feePaid') {
          const total = field === 'totalFee' ? Number(value) : s.totalFee;
          const paid = field === 'feePaid' ? Number(value) : s.feePaid;
          updated.balance = Math.max(0, total - paid);
        }
        
        return updated;
      }
      return s;
    }));
  };

  // Handle session changes
  const handleSessionChange = (studentId, sessionIndex, field, value) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const newSessions = [...s.sessions];
        newSessions[sessionIndex] = { 
          ...newSessions[sessionIndex], 
          [field]: field === 'date' ? value : Number(value) || 0,
          vehicleType: newSessions[sessionIndex].vehicleType || s.category
        };
        return { 
          ...s, 
          sessions: newSessions,
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    }));
  };

  const addSession = (studentId) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const newEntry = { 
          date: new Date().toISOString().split('T')[0], 
          ground: 0, 
          simulation: 0, 
          road: 0, 
          vehicleType: s.category
        };
        return { 
          ...s, 
          sessions: [newEntry, ...s.sessions],
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    }));
  };

  const removeSession = (studentId, idx) => {
    setStudents(prev => prev.map(s => s.id === studentId ? 
      { 
        ...s, 
        sessions: s.sessions.filter((_, i) => i !== idx),
        updatedAt: new Date().toISOString()
      } : s
    ));
  };

  // ✅ FIXED: Save all student data with proper date handling
  const handleSave = async (student) => {
    setSavingStudents(prev => ({ ...prev, [student.id]: true }));
    
    const tid = toast.loading(`Updating ${student.studentName}...`);
    try {
      // Format data for the new schema
      const saveData = {
        id: student.id, // User ID
        studentName: student.studentName,
        phone: student.phone,
        dob: student.dob,
        appNumber: student.applicationNumber,
        llDate: student.llDate || null,
        dlDate: student.dlDate || null,
        validity: student.validity || null,
        feePaid: Number(student.feePaid) || 0,
        balance: student.balance || 0,
        category: student.category,
        sessions: student.sessions.map(session => ({
          date: session.date,
          ground: Number(session.ground) || 0,
          simulation: Number(session.simulation) || 0,
          road: Number(session.road) || 0,
          vehicleType: session.vehicleType || student.category
        }))
      };

      console.log('Sending data to backend:', JSON.stringify(saveData, null, 2));

      const response = await fetch('http://localhost:8080/api/students/update-registry', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(saveData)
      });
      
      const result = await response.json();
      
      console.log('Backend response:', response.status, result);
      
      if (response.ok) {
        // Simulate delay for animation
        await new Promise(resolve => setTimeout(resolve, 800));
        
        toast.success(`✅ ${student.studentName} updated successfully`, { id: tid });
        
        // Update local state with new data from backend if available
        setStudents(prev => prev.map(s => 
          s.id === student.id ? { 
            ...s, 
            updatedAt: new Date().toISOString(),
            ...(result.updatedAt && { updatedAt: result.updatedAt })
          } : s
        ));
        
        // Show success animation
        setTimeout(() => {
          setSavingStudents(prev => ({ ...prev, [student.id]: false }));
        }, 300);
        
      } else {
        throw new Error(result.error || result.message || `Update failed with status ${response.status}`);
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error(`❌ Update Failed: ${err.message}`, { id: tid });
      setSavingStudents(prev => ({ ...prev, [student.id]: false }));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name} permanently? This action cannot be undone.`)) return;
    
    const tid = toast.loading("Deleting...");
    try {
      const res = await fetch(`http://localhost:8080/api/students/delete/${id}`, { 
        method: 'DELETE' 
      });
      
      if (res.ok) {
        const result = await res.json();
        setStudents(prev => prev.filter(s => s.id !== id));
        toast.success(`✅ Student deleted successfully (${result.deleted.registry ? 'Registry' : 'User'} removed)`, { id: tid });
      } else {
        throw new Error('Delete failed');
      }
    } catch (e) { 
      console.error('Delete error:', e);
      toast.error("❌ Delete Failed", { id: tid }); 
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Student Name', 'Application Number', 'Phone', 'DOB',
      'Category', 'Total Fee', 'Fee Paid', 'Balance',
      'LL Date', 'DL Date', 'LL Validity', 'Sessions Count',
      'Status', 'Total Ground', 'Total Simulation', 'Total Road'
    ];
    
    const csvData = students.map(student => [
      student.studentName,
      student.applicationNumber,
      student.phone,
      student.dob,
      student.category,
      student.totalFee,
      student.feePaid,
      student.balance,
      student.llDate,
      student.dlDate,
      student.validity,
      student.sessions.length,
      student.status,
      student.attendanceStats.totalGroundSessions || 0,
      student.attendanceStats.totalSimulationSessions || 0,
      student.attendanceStats.totalRoadSessions || 0
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('CSV exported successfully');
  };

  // Bulk actions
  const toggleBulkSelect = (id) => {
    setBulkSelect(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const bulkDelete = () => {
    if (bulkSelect.length === 0) {
      toast.error('No students selected');
      return;
    }
    
    if (window.confirm(`Delete ${bulkSelect.length} selected students?`)) {
      bulkSelect.forEach(async (id) => {
        const student = students.find(s => s.id === id);
        if (student) {
          await handleDelete(id, student.studentName);
        }
      });
      setBulkSelect([]);
    }
  };

  // Calculate stats
  const calculateStats = () => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const completedStudents = students.filter(s => s.status === 'completed').length;
    const totalSessions = students.reduce((acc, s) => acc + s.sessions.length, 0);
    
    return { totalStudents, activeStudents, completedStudents, totalSessions };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Database className="text-blue-500" size={20} /> STUDENT REGISTRY
          </h1>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">
            Multi-Schema Database • {stats.totalStudents} Total • {stats.activeStudents} Active
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-grow lg:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search by name or application #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm w-full lg:w-64 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-[#0f172a]">
                {cat.replace('-', ' ').toUpperCase()}
              </option>
            ))}
          </select>
          
          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-500/20 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-white transition-all"
          >
            <Download size={16} />
            <span className="text-sm font-semibold hidden sm:inline">Export CSV</span>
          </button>
          
          {/* Refresh Button */}
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500/20 text-blue-500 border border-blue-500/20 rounded-xl hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="text-sm font-semibold hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalStudents}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Total Students</div>
            </div>
            <User className="text-blue-400" size={20} />
          </div>
        </div>
        
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">{stats.activeStudents}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Active</div>
            </div>
            <FileText className="text-emerald-400" size={20} />
          </div>
        </div>
        
        <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalSessions}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Sessions</div>
            </div>
            <Calendar className="text-purple-400" size={20} />
          </div>
        </div>
        
        <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">
                {students.reduce((acc, s) => acc + (s.attendanceStats?.totalSessions || 0), 0)}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Total Training</div>
            </div>
            <CreditCard className="text-cyan-400" size={20} />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {bulkSelect.length > 0 && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-sm text-blue-400">
            {bulkSelect.length} student(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={bulkDelete}
              className="px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white text-sm transition-all"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setBulkSelect([])}
              className="px-3 py-1.5 bg-white/5 text-slate-400 rounded-lg hover:bg-white/10 text-sm transition-all"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* CSV-like Table */}
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[calc(100vh-320px)]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#0f172a]">
              <tr className="border-b border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={bulkSelect.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBulkSelect(filteredStudents.map(s => s.id));
                      } else {
                        setBulkSelect([]);
                      }
                    }}
                    className="rounded border-white/20 bg-white/5"
                  />
                </th>
                <th className="p-3 border-r border-white/10 min-w-[180px]">
                  <div className="flex items-center gap-1">
                    <User size={10} />
                    <span>Personal Info</span>
                  </div>
                </th>
                <th className="p-3 border-r border-white/10 min-w-[150px]">
                  <div className="flex items-center gap-1">
                    <FileText size={10} />
                    <span>Registry Details</span>
                  </div>
                </th>
                <th className="p-3 border-r border-white/10 text-center min-w-[130px]">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar size={10} />
                    <span>Test Dates</span>
                  </div>
                </th>
                <th className="p-3 border-r border-white/10 text-center min-w-[120px]">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar size={10} />
                    <span>LL Validity</span>
                  </div>
                </th>
                <th className="p-3 border-r border-white/10 text-center min-w-[140px]">
                  <div className="flex items-center justify-center gap-1">
                    <CreditCard size={10} />
                    <span>Financials</span>
                  </div>
                </th>
                <th className="p-3 border-r border-white/10 text-center min-w-[250px] sm:min-w-[300px]">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar size={10} />
                    <span>Attendance Sessions</span>
                  </div>
                </th>
                <th className="p-3 text-center min-w-[120px]">
                  <div className="flex items-center justify-center gap-1">
                    <Save size={10} />
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                // Skeleton Loading Rows
                skeletonStudents.map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    <td className="p-3">
                      <div className="w-4 h-4 bg-white/10 rounded"></div>
                    </td>
                    <td className="p-3 border-r border-white/10">
                      <div className="space-y-2">
                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                        <div className="h-3 bg-white/10 rounded w-1/2"></div>
                        <div className="h-3 bg-white/10 rounded w-2/3"></div>
                      </div>
                    </td>
                    <td className="p-3 border-r border-white/10">
                      <div className="space-y-2">
                        <div className="h-4 bg-white/10 rounded w-full"></div>
                        <div className="h-3 bg-white/10 rounded w-2/3"></div>
                        <div className="h-3 bg-white/10 rounded w-1/2"></div>
                      </div>
                    </td>
                    <td className="p-3 border-r border-white/10">
                      <div className="space-y-3">
                        <div className="h-3 bg-white/10 rounded"></div>
                        <div className="h-3 bg-white/10 rounded"></div>
                      </div>
                    </td>
                    <td className="p-3 border-r border-white/10">
                      <div className="h-8 bg-white/10 rounded"></div>
                    </td>
                    <td className="p-3 border-r border-white/10">
                      <div className="space-y-3">
                        <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-6 bg-white/10 rounded"></div>
                          <div className="h-6 bg-white/10 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 border-r border-white/10">
                      <div className="flex flex-col gap-3">
                        <div className="max-h-40 overflow-y-auto pr-2">
                          <div className="grid grid-cols-12 gap-1 mb-2">
                            {[...Array(12)].map((_, i) => (
                              <div key={i} className="h-3 bg-white/10 rounded col-span-1"></div>
                            ))}
                          </div>
                          {[...Array(2)].map((_, i) => (
                            <div key={i} className="grid grid-cols-12 gap-1 mb-2">
                              {[...Array(12)].map((_, j) => (
                                <div key={j} className="h-6 bg-white/10 rounded col-span-1"></div>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="h-8 bg-white/10 rounded"></div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-2">
                        <div className="h-10 bg-white/10 rounded"></div>
                        <div className="h-10 bg-white/10 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Database className="text-slate-500" size={32} />
                      <span className="text-sm text-slate-400">No students found</span>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="text-xs text-blue-500 hover:text-blue-400"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className={`hover:bg-white/[0.01] transition-colors ${
                      bulkSelect.includes(student.id) ? 'bg-blue-500/5' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={bulkSelect.includes(student.id)}
                        onChange={() => toggleBulkSelect(student.id)}
                        className="rounded border-white/20 bg-white/5"
                      />
                    </td>

                    {/* Personal Info (User/Profile Models) */}
                    <td className="p-3 border-r border-white/10 min-w-[180px]">
                      <div className="space-y-2">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
                            <User size={8} />
                            Student Name
                          </div>
                          <input
                            type="text"
                            value={student.studentName}
                            onChange={(e) => handlePersonalInfoChange(student.id, 'studentName', e.target.value)}
                            className="w-full bg-blue-500/5 p-2 text-sm font-bold focus:outline-none focus:bg-blue-500/10 rounded border border-transparent focus:border-blue-500/30"
                            placeholder="Full Name"
                          />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
                            <Phone size={8} />
                            Phone
                          </div>
                          <input
                            type="tel"
                            value={student.phone}
                            onChange={(e) => handlePersonalInfoChange(student.id, 'phone', e.target.value)}
                            className="w-full bg-transparent p-1.5 text-xs text-slate-400 font-bold outline-none border border-transparent focus:border-blue-500/30 rounded"
                            placeholder="Phone Number"
                          />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
                            <Calendar size={8} />
                            Date of Birth
                          </div>
                          <input
                            type="date"
                            value={student.dob}
                            onChange={(e) => handlePersonalInfoChange(student.id, 'dob', e.target.value)}
                            className="w-full bg-transparent p-1.5 text-xs text-slate-500 outline-none border border-transparent focus:border-blue-500/30 rounded"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Registry Details (StudentRegistry Model) */}
                    <td className="p-3 border-r border-white/10 min-w-[150px]">
                      <div className="space-y-2">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                            Application #
                          </div>
                          <input
                            type="text"
                            value={student.applicationNumber}
                            onChange={(e) => handleRegistryInfoChange(student.id, 'applicationNumber', e.target.value)}
                            className="w-full bg-transparent p-1.5 text-xs font-mono text-blue-400 outline-none border border-transparent focus:border-blue-500/30 rounded"
                            placeholder="APP-0001"
                          />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                            Vehicle Category
                          </div>
                          <select
                            value={student.category}
                            onChange={(e) => handleRegistryInfoChange(student.id, 'category', e.target.value)}
                            className="w-full bg-blue-600/20 text-blue-400 text-xs p-1.5 rounded border border-blue-500/20 uppercase font-bold outline-none cursor-pointer"
                          >
                            {categories.map(c => (
                              <option key={c} value={c} className="bg-[#0f172a]">
                                {c.replace('-', ' ')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                            Status
                          </div>
                          <select
                            value={student.status}
                            onChange={(e) => handleRegistryInfoChange(student.id, 'status', e.target.value)}
                            className="w-full bg-white/5 text-slate-400 text-xs p-1.5 rounded border border-white/10 uppercase font-bold outline-none cursor-pointer"
                          >
                            <option value="active" className="bg-[#0f172a]">Active</option>
                            <option value="completed" className="bg-[#0f172a]">Completed</option>
                            <option value="discontinued" className="bg-[#0f172a]">Discontinued</option>
                            <option value="on_hold" className="bg-[#0f172a]">On Hold</option>
                          </select>
                        </div>
                      </div>
                    </td>

                    {/* Test Dates (StudentRegistry Model) */}
                    <td className="p-3 border-r border-white/10 min-w-[130px]">
                      <div className="space-y-3">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">LL Date</div>
                          <input
                            type="date"
                            value={student.llDate}
                            onChange={(e) => handleRegistryInfoChange(student.id, 'llDate', e.target.value)}
                            className="w-full bg-white/5 p-1.5 rounded text-xs outline-none border border-transparent focus:border-blue-500/30"
                          />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">DL Date</div>
                          <input
                            type="date"
                            value={student.dlDate}
                            onChange={(e) => handleRegistryInfoChange(student.id, 'dlDate', e.target.value)}
                            className="w-full bg-white/5 p-1.5 rounded text-xs outline-none border border-transparent focus:border-blue-500/30"
                          />
                        </div>
                      </div>
                    </td>

                    {/* LL Validity (StudentRegistry Model) */}
                    <td className="p-3 border-r border-white/10 min-w-[120px]">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">LL Valid Until</div>
                        <input
                          type="date"
                          value={student.validity}
                          onChange={(e) => handleRegistryInfoChange(student.id, 'validity', e.target.value)}
                          className="bg-white/5 p-2 rounded text-xs text-orange-400 outline-none border border-transparent focus:border-orange-500/30 text-center w-full"
                        />
                      </div>
                    </td>

                    {/* Financials (Payment Model) - Only Total Fee and Paid Amount inputs */}
                    <td className="p-3 border-r border-white/10 min-w-[140px]">
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-[8px] text-slate-500 uppercase font-bold">TOTAL FEE</div>
                          <input
                            type="number"
                            value={student.totalFee}
                            onChange={(e) => handleRegistryInfoChange(student.id, 'totalFee', e.target.value)}
                            className="w-full bg-cyan-500/10 p-1.5 rounded text-xs text-center text-cyan-400 font-bold outline-none border border-transparent focus:border-cyan-500/30"
                            min="0"
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <div>
                            <div className="text-[8px] text-emerald-500 uppercase font-bold">PAID AMOUNT</div>
                            <input
                              type="number"
                              value={student.feePaid}
                              onChange={(e) => handleRegistryInfoChange(student.id, 'feePaid', e.target.value)}
                              className="w-full bg-emerald-500/10 p-1.5 rounded text-xs text-center text-emerald-500 font-bold outline-none border border-transparent focus:border-emerald-500/30"
                              min="0"
                              max={student.totalFee}
                            />
                          </div>
                          <div>
                            <div className="text-[8px] text-red-500 uppercase font-bold">BALANCE</div>
                            <div className="w-full bg-red-500/10 p-1.5 rounded text-xs text-center text-red-500 font-bold border border-red-500/20">
                              ₹{student.balance}
                            </div>
                          </div>
                        </div>
                        {/* Status indicator */}
                        <div className="text-center">
                          <div className="text-[7px] uppercase font-bold mb-1">Payment Status</div>
                          <div className={`text-[9px] font-bold px-2 py-1 rounded ${
                            student.balance === 0 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : student.feePaid === 0
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {student.balance === 0 ? 'COMPLETED' : student.feePaid === 0 ? 'PENDING' : 'PARTIAL'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Attendance Sessions (StudentRegistry Model) */}
                    <td className="p-3 border-r border-white/10 min-w-[250px] sm:min-w-[300px]">
                      <div className="flex flex-col gap-3">
                        {/* Sessions List */}
                        <div className="max-h-40 overflow-y-auto pr-2">
                          <div className="grid grid-cols-12 gap-1 text-[8px] text-slate-500 uppercase font-bold mb-1 px-1">
                            <div className="col-span-4 text-center">Vehicle Type</div>
                            <div className="col-span-2 text-center">G</div>
                            <div className="col-span-2 text-center">S</div>
                            <div className="col-span-2 text-center">R</div>
                            <div className="col-span-2 text-right">Actions</div>
                          </div>
                          
                          {student.sessions && student.sessions.length > 0 ? (
                            student.sessions.map((sess, idx) => (
                              <div
                                key={sess._id || idx}
                                className="grid grid-cols-12 gap-1 items-center bg-white/5 p-1.5 rounded border border-white/5 hover:border-white/10 transition-all mb-1"
                              >
                                <div className="col-span-4 flex justify-center">
                                  <span className={`px-2 py-1 rounded text-[9px] font-bold flex items-center gap-1 ${
                                    sess.vehicleType?.includes('two') 
                                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' 
                                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                                  }`}>
                                    {sess.vehicleType?.includes('two') ? <Bike size={10} /> : <Car size={10} />}
                                    <span className="uppercase">
                                      {sess.vehicleType?.replace('-', ' ').substring(0, 10)}
                                      {sess.vehicleType?.length > 10 ? '...' : ''}
                                    </span>
                                  </span>
                                </div>
                                
                                <div className="col-span-2">
                                  <input
                                    type="number"
                                    value={sess.ground}
                                    onChange={e => handleSessionChange(student.id, idx, 'ground', e.target.value)}
                                    className="w-full bg-transparent text-xs text-center font-bold outline-none border border-white/10 rounded p-1"
                                    min="0"
                                  />
                                </div>
                                
                                <div className="col-span-2">
                                  <input
                                    type="number"
                                    value={sess.simulation}
                                    onChange={e => handleSessionChange(student.id, idx, 'simulation', e.target.value)}
                                    className="w-full bg-transparent text-xs text-center font-bold text-blue-400 outline-none border border-blue-500/20 rounded p-1"
                                    min="0"
                                  />
                                </div>
                                
                                <div className="col-span-2">
                                  <input
                                    type="number"
                                    value={sess.road}
                                    onChange={e => handleSessionChange(student.id, idx, 'road', e.target.value)}
                                    className="w-full bg-transparent text-xs text-center font-bold text-emerald-500 outline-none border border-emerald-500/20 rounded p-1"
                                    min="0"
                                  />
                                </div>
                                
                                <div className="col-span-2 flex justify-end">
                                  <button
                                    onClick={() => removeSession(student.id, idx)}
                                    className="text-slate-500 hover:text-red-500 p-0.5 transition-colors"
                                    title="Remove session"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-slate-500 text-xs">
                              No attendance sessions recorded
                            </div>
                          )}
                        </div>

                        {/* Add Session Button */}
                        <button
                          onClick={() => addSession(student.id)}
                          className="flex items-center justify-center gap-1 border border-dashed border-white/10 rounded py-2 text-xs text-slate-400 hover:text-blue-400 hover:border-blue-500/30 uppercase font-bold transition-all w-full"
                        >
                          <PlusCircle size={12} />
                          Add Session
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3 min-w-[120px]">
                      <div className="flex flex-col gap-2 items-center">
                        {/* Save Button with Animation */}
                        <button
                          onClick={() => handleSave(student)}
                          disabled={savingStudents[student.id]}
                          className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all border w-full justify-center overflow-hidden ${
                            savingStudents[student.id]
                              ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/30 cursor-not-allowed'
                              : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white shadow-lg shadow-emerald-500/10'
                          }`}
                          title="Save changes"
                        >
                          {savingStudents[student.id] ? (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent animate-shimmer"></div>
                              <Clock className="animate-pulse" size={14} />
                              <span className="text-xs font-semibold">Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save size={14} />
                              <span className="text-xs font-semibold">Save</span>
                            </>
                          )}
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(student.id, student.studentName)}
                          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/10 w-full justify-center"
                          title="Delete student"
                        >
                          <Trash2 size={14} />
                          <span className="text-xs font-semibold">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex flex-wrap gap-3 sm:gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500/20 rounded-full border border-blue-500/30"></div>
          <span>User Model: Personal Information</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500/20 rounded-full border border-emerald-500/30"></div>
          <span>Registry Model: Attendance & Test Data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-500/20 rounded-full border border-cyan-500/30"></div>
          <span>Payment Model: Financial Information</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500/20 rounded-full border border-purple-500/30"></div>
          <span>Changes saved across all collections</span>
        </div>
      </div>
    </div>
  );
};

export default StudentDatas;