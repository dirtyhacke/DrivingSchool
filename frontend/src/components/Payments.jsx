import React, { useState, useEffect } from 'react';
import { 
  CreditCard, QrCode, Upload, CheckCircle2, 
  Loader2, Shield, Smartphone, Copy,
  ExternalLink, Save, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const Payments = () => {
  const [loading, setLoading] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState({
    adminUpiId: '',
    adminPhone: '',
    adminQrCode: null,
    existingQrUrl: ''
  });
  const [qrFile, setQrFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPaymentConfig();
  }, []);

  const fetchPaymentConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://drivingschool-9b6b.onrender.com/api/payments/config');
      const result = await res.json();
      
      if (result.success) {
        setPaymentConfig({
          adminUpiId: result.config?.adminUpiId || '',
          adminPhone: result.config?.adminPhone || '',
          existingQrUrl: result.config?.adminQrCode || '',
          adminQrCode: null
        });
      }
    } catch (err) {
      console.error("Error fetching config:", err);
      toast.error('Failed to load payment configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    if (!paymentConfig.adminUpiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    
    formData.append('adminUpiId', paymentConfig.adminUpiId);
    formData.append('adminPhone', paymentConfig.adminPhone);
    formData.append('existingQrUrl', paymentConfig.existingQrUrl);
    
    if (qrFile) {
      formData.append('qrImage', qrFile);
    }

    try {
      const res = await fetch('https://drivingschool-9b6b.onrender.com/api/payments/update-config', {
        method: 'POST',
        body: formData
      });
      
      const result = await res.json();
      
      if (result.success) {
        toast.success('Payment configuration saved!');
        setIsEditing(false);
        setQrFile(null);
        fetchPaymentConfig();
      } else {
        toast.error(result.message || 'Failed to save configuration');
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = (text, fieldName) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(`${fieldName} copied to clipboard!`);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  const handleUpiPayment = () => {
    if (!paymentConfig.adminUpiId) {
      toast.error('UPI ID not configured');
      return;
    }
    
    const upiUrl = `upi://pay?pa=${encodeURIComponent(paymentConfig.adminUpiId)}&pn=${encodeURIComponent('Driving School')}&cu=INR&tn=${encodeURIComponent('Payment for Driving School')}`;
    
    // Try to open UPI app
    window.location.href = upiUrl;
    
    // Fallback: Copy UPI ID to clipboard
    navigator.clipboard.writeText(paymentConfig.adminUpiId)
      .then(() => {
        toast.success(`UPI ID copied! Open your UPI app and paste: ${paymentConfig.adminUpiId}`);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setQrFile(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentConfig(prev => ({
          ...prev,
          adminQrCode: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading && !paymentConfig.adminUpiId) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-slate-200 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-blue-500" size={32} />
          <p className="text-sm opacity-60">Loading payment configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 p-4 md:p-8 font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <CreditCard className="text-blue-500" size={24} />
              Payment Configuration
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Set up payment details for all students
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={fetchPaymentConfig}
              className="px-4 py-2 rounded-xl bg-slate-500/10 text-slate-500 border border-slate-500/20 hover:bg-slate-500 hover:text-white transition-all flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Configuration Form */}
        <div className="space-y-6">
          <div className="bg-[#16161a] border border-white/5 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">Admin Payment Setup</h2>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">
                  Admin UPI ID
                </label>
                <input 
                  type="text"
                  value={paymentConfig.adminUpiId}
                  onChange={(e) => setPaymentConfig(prev => ({ ...prev, adminUpiId: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none transition-all text-white disabled:opacity-50"
                  placeholder="merchant@upi"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">
                  Admin Phone Number
                </label>
                <input 
                  type="tel"
                  value={paymentConfig.adminPhone}
                  onChange={(e) => setPaymentConfig(prev => ({ ...prev, adminPhone: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none transition-all text-white disabled:opacity-50"
                  placeholder="+91 9876543210"
                />
              </div>

              {/* QR Code Upload */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">
                  UPI QR Code
                </label>
                
                {isEditing ? (
                  <div className="relative group border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto text-slate-500 group-hover:text-blue-500 mb-2" size={20} />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {qrFile ? qrFile.name : 'Click to upload QR image'}
                    </p>
                    <p className="text-[9px] text-slate-500 mt-1">
                      PNG, JPG (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="border border-white/10 rounded-xl p-4 text-center">
                    {paymentConfig.existingQrUrl ? (
                      <div>
                        <p className="text-sm text-slate-400 mb-2">QR Code is configured</p>
                        <a 
                          href={paymentConfig.existingQrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-400 text-sm flex items-center justify-center gap-1"
                        >
                          View QR Code <ExternalLink size={12} />
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No QR code uploaded yet</p>
                    )}
                  </div>
                )}
              </div>

              {isEditing && (
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Save size={16} />
                      Save Configuration
                    </>
                  )}
                </button>
              )}
            </form>
          </div>

          {/* Current Configuration Display */}
          {!isEditing && (
            <div className="bg-[#16161a] border border-white/5 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">
                Current Configuration
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-500/10 rounded-lg">
                  <span className="text-sm text-slate-400">UPI ID:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-blue-400">
                      {paymentConfig.adminUpiId || 'Not set'}
                    </code>
                    {paymentConfig.adminUpiId && (
                      <button
                        onClick={() => handleCopyToClipboard(paymentConfig.adminUpiId, 'UPI ID')}
                        className="p-1 hover:bg-blue-500/20 rounded"
                        title="Copy UPI ID"
                      >
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-500/10 rounded-lg">
                  <span className="text-sm text-slate-400">Phone:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-blue-400">
                      {paymentConfig.adminPhone || 'Not set'}
                    </code>
                    {paymentConfig.adminPhone && (
                      <button
                        onClick={() => handleCopyToClipboard(paymentConfig.adminPhone, 'Phone')}
                        className="p-1 hover:bg-blue-500/20 rounded"
                        title="Copy Phone"
                      >
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Preview & Instructions */}
        <div className="space-y-6">
          <div className="bg-[#16161a] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <QrCode size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">QR Code Preview</h2>
            </div>

            <div className="flex flex-col items-center justify-center py-8">
              {(paymentConfig.adminQrCode || paymentConfig.existingQrUrl) ? (
                <>
                  <div className="mb-6 border-4 border-white/20 rounded-xl p-4 bg-white">
                    <img 
                      src={paymentConfig.adminQrCode || paymentConfig.existingQrUrl} 
                      alt="UPI QR Code" 
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                  <p className="text-sm text-slate-400 text-center">
                    Students will scan this QR code to make payments
                  </p>
                </>
              ) : (
                <div className="text-center py-12">
                  <QrCode className="mx-auto mb-4 text-slate-500 opacity-40" size={64} />
                  <p className="text-sm text-slate-500">No QR code uploaded yet</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Upload a QR code to enable scanning payments
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#16161a] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Smartphone size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">Payment Instructions</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <span className="text-xs font-bold text-blue-500">1</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">QR Code Payment</h4>
                  <p className="text-sm text-slate-400">
                    Students can scan the QR code using any UPI app to make payments instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                  <span className="text-xs font-bold text-emerald-500">2</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">UPI ID Payment</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm font-mono bg-slate-500/20 px-3 py-1 rounded">
                      {paymentConfig.adminUpiId || 'Not configured'}
                    </code>
                    {paymentConfig.adminUpiId && (
                      <button
                        onClick={handleUpiPayment}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        Pay Now
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">
                    Students can enter this UPI ID manually in their payment app.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-amber-500/20 p-2 rounded-lg">
                  <span className="text-xs font-bold text-amber-500">3</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Phone Payment</h4>
                  <p className="text-sm text-slate-400">
                    For assistance, students can call: 
                    <span className="font-mono text-blue-400 ml-2">
                      {paymentConfig.adminPhone || 'Not configured'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-500/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="text-emerald-500" size={16} />
                <span className="text-sm font-bold text-white">Important Note</span>
              </div>
              <p className="text-xs text-slate-400">
                These payment details will be visible to all students in their dashboard. 
                Any updates here will affect payment information for all users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;