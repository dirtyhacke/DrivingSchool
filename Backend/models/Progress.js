import mongoose from 'mongoose';

/**
 * courseSchema - Represents individual vehicle progress
 * Added: sessions array to store history of entries by date
 */
const courseSchema = new mongoose.Schema({
    vehicleType: { 
        type: String, 
        enum: ['four-wheeler', 'two-wheeler', 'heavy-vehicle', 'finished'],
        default: 'four-wheeler' 
    },
    attendance: { 
        type: [Number], 
        default: () => Array(1500).fill(0) 
    },
    // --- THIS IS THE CRITICAL UPDATE ---
    // Stores an array of objects: { date, road, ground, simulation, id }
    sessions: {
        type: [mongoose.Schema.Types.Mixed], 
        default: []
    },
    // -----------------------------------
    gridRows: { 
        type: Number, 
        default: 30 
    },
    gridCols: { 
        type: Number, 
        default: 50 
    }
});

const progressSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    /**
     * courses: An array of vehicle objects. 
     * Note: I added 'progress' as an alias if your frontend uses that key.
     */
    courses: {
        type: [courseSchema],
        default: [{
            vehicleType: 'four-wheeler',
            attendance: Array(1500).fill(0),
            sessions: [],
            gridRows: 30,
            gridCols: 50
        }]
    }
}, { 
    timestamps: true,
    // Minimize allows empty arrays/objects to be saved to DB
    minimize: false 
});

// If you ever use the key 'progress' instead of 'courses' in your queries
progressSchema.virtual('progress').get(function() {
    return this.courses;
});

export const Progress = mongoose.model('Progress', progressSchema);