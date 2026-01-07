import mongoose from 'mongoose';

/**
 * Attendance Session Schema
 */
const attendanceSessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  ground: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  simulation: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  road: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  vehicleType: {
    type: String,
    enum: ['four-wheeler', 'two-wheeler', 'heavy-vehicle', 'finished'],
    default: 'four-wheeler'
  }
}, {
  timestamps: true
});

/**
 * Main Student Registry Schema
 */
const studentRegistrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  applicationNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  vehicleCategory: {
    type: String,
    enum: ['four-wheeler', 'two-wheeler', 'heavy-vehicle', 'finished'],
    default: 'four-wheeler'
  },
  
  attendanceSessions: [attendanceSessionSchema],
  
  testDates: {
    llDate: {
      type: Date,
      default: null
    },
    dlDate: {
      type: Date,
      default: null
    }
  },
  
  licenseValidity: {
    type: Date,
    default: null
  },
  
  financialSummary: {
    totalFee: {
      type: Number,
      default: 0,
      min: 0
    },
    feePaid: {
      type: Number,
      default: 0,
      min: 0
    },
    balance: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  attendanceStats: {
    totalGroundSessions: {
      type: Number,
      default: 0
    },
    totalSimulationSessions: {
      type: Number,
      default: 0
    },
    totalRoadSessions: {
      type: Number,
      default: 0
    },
    totalSessions: {
      type: Number,
      default: 0
    }
  },
  
  status: {
    type: String,
    enum: ['active', 'completed', 'discontinued', 'on_hold'],
    default: 'active'
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for overall completion status
studentRegistrySchema.virtual('completionPercentage').get(function() {
  const { totalGroundSessions, totalSimulationSessions, totalRoadSessions } = this.attendanceStats;
  const total = totalGroundSessions + totalSimulationSessions + totalRoadSessions;
  
  const maxSessions = 40;
  return Math.min(100, Math.round((total / maxSessions) * 100));
});

// Virtual for next recommended training
studentRegistrySchema.virtual('nextTrainingRecommendation').get(function() {
  const { totalGroundSessions, totalSimulationSessions, totalRoadSessions } = this.attendanceStats;
  
  if (totalGroundSessions < 20) return 'More ground training needed';
  if (totalSimulationSessions < 10) return 'Focus on simulation training';
  if (totalRoadSessions < 10) return 'Ready for road training';
  return 'All training completed';
});

// ✅ FIXED: Pre-save middleware with proper error handling
studentRegistrySchema.pre('save', async function(next) {
  try {
    // Only calculate if attendanceSessions exist
    if (this.attendanceSessions && Array.isArray(this.attendanceSessions)) {
      let totalGround = 0;
      let totalSimulation = 0;
      let totalRoad = 0;
      
      this.attendanceSessions.forEach(session => {
        totalGround += Number(session.ground) || 0;
        totalSimulation += Number(session.simulation) || 0;
        totalRoad += Number(session.road) || 0;
      });
      
      this.attendanceStats = {
        totalGroundSessions: totalGround,
        totalSimulationSessions: totalSimulation,
        totalRoadSessions: totalRoad,
        totalSessions: totalGround + totalSimulation + totalRoad
      };
      
      // Auto-update status based on attendance
      if (this.attendanceStats.totalSessions >= 40) {
        this.status = 'completed';
      }
    }
    
    // Update last updated timestamp
    this.lastUpdated = new Date();
    
    // ✅ Ensure next() is called properly
    if (next && typeof next === 'function') {
      next();
    }
  } catch (error) {
    // ✅ Handle errors properly
    if (next && typeof next === 'function') {
      next(error);
    } else {
      throw error;
    }
  }
});

// ✅ ALTERNATIVE: If you're using async/await, you can remove next entirely:
// studentRegistrySchema.pre('save', async function() {
//   // Calculate attendance statistics
//   if (this.attendanceSessions && Array.isArray(this.attendanceSessions)) {
//     let totalGround = 0;
//     let totalSimulation = 0;
//     let totalRoad = 0;
    
//     this.attendanceSessions.forEach(session => {
//       totalGround += Number(session.ground) || 0;
//       totalSimulation += Number(session.simulation) || 0;
//       totalRoad += Number(session.road) || 0;
//     });
    
//     this.attendanceStats = {
//       totalGroundSessions: totalGround,
//       totalSimulationSessions: totalSimulation,
//       totalRoadSessions: totalRoad,
//       totalSessions: totalGround + totalSimulation + totalRoad
//     };
    
//     // Auto-update status based on attendance
//     if (this.attendanceStats.totalSessions >= 40) {
//       this.status = 'completed';
//     }
//   }
  
//   this.lastUpdated = new Date();
// });

// Indexes
studentRegistrySchema.index({ applicationNumber: 1 });
studentRegistrySchema.index({ vehicleCategory: 1 });
studentRegistrySchema.index({ status: 1 });
studentRegistrySchema.index({ 'testDates.llDate': 1 });
studentRegistrySchema.index({ 'testDates.dlDate': 1 });

// Static Methods
studentRegistrySchema.statics.findByApplicationNumber = function(appNumber) {
  return this.findOne({ applicationNumber: appNumber });
};

studentRegistrySchema.statics.findByVehicleCategory = function(category) {
  return this.find({ vehicleCategory: category });
};

studentRegistrySchema.statics.findActiveStudents = function() {
  return this.find({ status: 'active' });
};

// Instance Methods
studentRegistrySchema.methods.addAttendanceSession = function(sessionData) {
  this.attendanceSessions.push({
    ...sessionData,
    vehicleType: sessionData.vehicleType || this.vehicleCategory
  });
  return this.save();
};

studentRegistrySchema.methods.removeAttendanceSession = function(sessionId) {
  this.attendanceSessions = this.attendanceSessions.filter(
    session => session._id.toString() !== sessionId
  );
  return this.save();
};

export const StudentRegistry = mongoose.model('StudentRegistry', studentRegistrySchema);