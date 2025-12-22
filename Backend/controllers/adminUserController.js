import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';

// --- FETCH ALL STUDENTS WITH PROFILES ---
export const getAllStudentDetails = async (req, res) => {
    try {
        // Fetch users (exclude password)
        const students = await User.find({}, '-password').sort({ createdAt: -1 });
        
        // Map profiles to users
        const studentDetails = await Promise.all(students.map(async (user) => {
            const profile = await Profile.findOne({ userId: user._id });
            return {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt,
                phoneNumber: profile?.phoneNumber || "No Number",
                address: profile?.address || "N/A",
                location: profile?.location || "N/A",
                profileImage: profile?.profileImage || ""
            };
        }));

        res.status(200).json({
            success: true,
            users: studentDetails
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Registry Sync Error" });
    }
};

// --- PERMANENT PURGE (USER + PROFILE) ---
export const terminateStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete from both collections
        const userDeleted = await User.findByIdAndDelete(id);
        const profileDeleted = await Profile.findOneAndDelete({ userId: id });

        if (!userDeleted) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "All records purged successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error during purge" });
    }
};