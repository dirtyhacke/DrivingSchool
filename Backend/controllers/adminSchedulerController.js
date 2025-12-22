import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';

export const getSchedulerUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'fullName email profileImage');
        const data = await Promise.all(users.map(async (user) => {
            let record = await Progress.findOne({ userId: user._id });
            
            if (!record) {
                record = await Progress.create({ 
                    userId: user._id,
                    courses: [{ 
                        vehicleType: 'four-wheeler',
                        attendance: Array(1500).fill(0),
                        gridRows: 30,
                        gridCols: 50
                    }]
                });
            }

            const doc = record.toObject();
            let sanitizedCourses = [];

            // NORMALIZE: If old data exists at top level, move it into the array
            if (doc.courses && Array.isArray(doc.courses)) {
                sanitizedCourses = doc.courses;
            } else {
                sanitizedCourses = [{
                    vehicleType: doc.vehicleType || 'four-wheeler',
                    attendance: doc.attendance || Array(1500).fill(0),
                    gridRows: doc.gridRows || 30,
                    gridCols: doc.gridCols || 50
                }];
            }

            return { user, courses: sanitizedCourses };
        }));
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateAttendance = async (req, res) => {
    const { userId, courses } = req.body; 
    try {
        await Progress.findOneAndUpdate(
            { userId },
            { $set: { courses: courses } }, 
            { upsert: true, new: true }
        );
        res.json({ success: true, message: "Saved" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Update Failed" });
    }
};