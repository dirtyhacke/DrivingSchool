import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: function() {
      return !this.isGlobalConfig; // Required only if not global config
    }
  },
  studentName: { 
    type: String, 
    required: function() {
      return !this.isGlobalConfig; // Required only if not global config
    }
  },
  paidAmount: { 
    type: Number, 
    default: 0 
  },
  remainingAmount: { 
    type: Number, 
    default: 0 
  },
  
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

  adminQrCode: { 
    type: String 
  }, 
  adminUpiId: { 
    type: String 
  },
  adminPhone: { 
    type: String 
  },
  
  // Flag to identify global configuration
  isGlobalConfig: {
    type: Boolean,
    default: false
  },
  
  // Flag to activate/deactivate configuration
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastPaymentDate: { 
    type: Date, 
    default: Date.now 
  } 
}, { 
  timestamps: true 
});

// Index for better query performance
paymentSchema.index({ userId: 1, isGlobalConfig: 1 });
paymentSchema.index({ isGlobalConfig: 1, isActive: 1 });

export const Payment = mongoose.model('Payment', paymentSchema);