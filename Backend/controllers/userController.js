import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });

        const newUser = await User.create({ fullName, email, password, role: 'user' });

        // Initialize with the new 'courses' array structure
        await Progress.create({
            userId: newUser._id,
            courses: [{
                vehicleType: 'four-wheeler',
                attendance: Array(1500).fill(0),
                gridRows: 30,
                gridCols: 50
            }]
        });
        
        res.status(201).json({ 
            success: true, 
            user: { _id: newUser._id, fullName: newUser.fullName, email: newUser.email, role: newUser.role } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating account" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

        res.json({ 
            success: true, 
            user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getUserProgress = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Use lean() for faster fetching and to ensure we get a plain JS object
        const progress = await Progress.findOne({ userId }).lean();
        const user = await User.findById(userId, 'fullName profileImage').lean();

        if (!progress) {
            return res.status(404).json({ success: false, message: "Progress record not found" });
        }

        res.json({
            success: true,
            data: { 
                user, 
                // CRITICAL: This sends the array the user side is looking for
                courses: progress.courses || [progress] 
            }
        });
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ success: false, message: "Error fetching data" });
    }
};