import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  
  // This supports the 'partial' and 'completed' logic from your frontend
  status: { 
    type: String, 
    enum: ['pending', 'partial', 'completed'], 
    default: 'pending' 
  },

  // Added Vehicle Category to match your UI dropdown
  vehicleCategory: { 
    type: String, 
    default: 'LMV' 
  },

  adminQrCode: { type: String }, 
  adminUpiId: { type: String },
  adminPhone: { type: String },
  
  lastPaymentDate: { type: Date, default: Date.now } 
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);