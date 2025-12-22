import mongoose from 'mongoose';

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
    gridRows: { type: Number, default: 30 },
    gridCols: { type: Number, default: 50 }
});

const progressSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // This is the core update: an array of course objects
    courses: {
        type: [courseSchema],
        default: [{
            vehicleType: 'four-wheeler',
            attendance: Array(1500).fill(0),
            gridRows: 30,
            gridCols: 50
        }]
    }
}, { timestamps: true });

export const Progress = mongoose.model('Progress', progressSchema);