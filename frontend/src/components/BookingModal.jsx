import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bike, Car, Truck, Calendar, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Dummy Data for Vehicle Options
const vehicleOptions = {
  'Two-Wheeler': [
    { id: 'scooter', name: 'Scooter (Automatic)', icon: '🛵' },
    { id: 'motorcycle', name: 'Motorcycle (Manual)', icon: '🏍️' },
  ],
  'Four-Wheeler': [
    { id: 'sedan', name: 'Sedan (Automatic)', icon: '🚗' },
    { id: 'hatchback', name: 'Hatchback (Manual)', icon: '🚙' },
    { id: 'suv', name: 'SUV (Automatic)', icon: '🛣️' },
  ],
  'Heavy Vehicle': [
    { id: 'bus', name: 'Bus', icon: '🚌' },
    { id: 'truck', name: 'Truck', icon: '🚚' },
  ],
};

const BookingModal = ({ isOpen, onClose }) => {
  const [selectedVehicleType, setSelectedVehicleType] = useState('Four-Wheeler');
  const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [loading, setLoading] = useState(false);

  const toastStyle = {
    style: {
      borderRadius: '16px',
      background: '#1e293b',
      color: '#fff',
      padding: '12px 24px',
      fontSize: '14px',
    },
  };

  const handleBookingSubmit = async () => {
    if (!selectedVehicleType || !selectedVehicleModel || !bookingDate || !bookingTime) {
      toast.error("Please fill all booking details!", toastStyle);
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Dummy API response for demonstration
    const success = Math.random() > 0.3; // 70% chance of success

    if (success) {
      toast.success("Booking confirmed! Check your email for details.", toastStyle);
      onClose();
      // Reset form
      setSelectedVehicleType('Four-Wheeler');
      setSelectedVehicleModel('');
      setBookingDate('');
      setBookingTime('');
    } else {
      toast.error("Booking failed. Please try again!", toastStyle);
    }
    setLoading(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="relative bg-white text-slate-900 p-6 sm:p-10 rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car size={32} />
              </div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Book Your Slot</h3>
              <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto">
                Select your preferred vehicle type, date, and time to start your training.
              </p>
            </div>

            <div className="space-y-6">
              {/* Vehicle Type Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 ml-2 uppercase tracking-wide">Vehicle Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Two-Wheeler', 'Four-Wheeler', 'Heavy Vehicle'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedVehicleType(type);
                        setSelectedVehicleModel(''); // Reset model when type changes
                      }}
                      className={`flex items-center justify-center p-4 rounded-xl text-sm font-semibold transition-all border-2 
                        ${selectedVehicleType === type
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                        }`}
                    >
                      {type === 'Two-Wheeler' && <Bike size={20} className="mr-2" />}
                      {type === 'Four-Wheeler' && <Car size={20} className="mr-2" />}
                      {type === 'Heavy Vehicle' && <Truck size={20} className="mr-2" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Model Selection */}
              {selectedVehicleType && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 ml-2 uppercase tracking-wide">
                    Select Model
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {vehicleOptions[selectedVehicleType].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedVehicleModel(option.id)}
                        className={`flex flex-col items-center p-3 rounded-xl text-xs font-medium transition-all border-2 h-24 justify-center
                          ${selectedVehicleModel === option.id
                            ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-200'
                          }`}
                      >
                        <span className="text-2xl mb-1">{option.icon}</span>
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bookingDate" className="block text-sm font-bold text-slate-700 mb-3 ml-2 uppercase tracking-wide">Booking Date</label>
                  <div className="relative">
                    <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      id="bookingDate"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={today}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="bookingTime" className="block text-sm font-bold text-slate-700 mb-3 ml-2 uppercase tracking-wide">Booking Time</label>
                  <div className="relative">
                    <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="time"
                      id="bookingTime"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleBookingSubmit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20} /> Confirm Booking</>}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;