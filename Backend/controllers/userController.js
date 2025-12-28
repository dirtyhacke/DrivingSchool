import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';
import nodemailer from 'nodemailer';

// --- NODEMAILER CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'swarajcn774@gmail.com',
        pass: 'cojx mjqw lujx vzlg' 
    }
});

// Verify connection on start
transporter.verify((error) => {
    if (error) console.log("❌ Email System Error:", error.message);
    else console.log("✅ Email System Ready");
});

// Internal helper for signup alerts
const sendAdminAlert = async (newUser) => {
    const mailOptions = {
        from: '"Driving School Alert" <swarajcn774@gmail.com>',
        to: 'swarajcn774@gmail.com',
        subject: `🚨 New Student Joined: ${newUser.fullName}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px; background-color: white;">
                <h2 style="color: #2563eb;">New Student Registration</h2>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1;">
                    <p><strong>Full Name:</strong> ${newUser.fullName}</p>
                    <p><strong>Email:</strong> ${newUser.email}</p>
                    <p><strong>User ID:</strong> ${newUser._id}</p>
                </div>
                <p style="font-size: 11px; color: #94a3b8;">Timestamp: ${new Date().toLocaleString()}</p>
            </div>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error("Mail error suppressed to prevent crash:", err.message);
    }
};

// --- SIGNUP ---
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });

        const newUser = await User.create({ fullName, email, password, role: 'user' });

        await Progress.create({
            userId: newUser._id,
            courses: [{
                vehicleType: 'four-wheeler',
                attendance: Array(1500).fill(0),
                gridRows: 30,
                gridCols: 50
            }]
        });

        // Trigger mail but DON'T await it - this prevents the signup from 
        // crashing if the email server is slow or disconnected
        sendAdminAlert(newUser);
        
        res.status(201).json({ 
            success: true, 
            user: { _id: newUser._id, fullName: newUser.fullName, email: newUser.email, role: newUser.role } 
        });
    } catch (error) {
        console.error("Signup Crash prevented:", error);
        res.status(500).json({ success: false, message: "Error creating account" });
    }
};

// --- LOGIN ---
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

// --- PROGRESS ---
export const getUserProgress = async (req, res) => {
    try {
        const { userId } = req.params;
        const progress = await Progress.findOne({ userId }).lean();
        const user = await User.findById(userId, 'fullName profileImage').lean();

        if (!progress) return res.status(404).json({ success: false, message: "Progress not found" });

        res.json({
            success: true,
            data: { user, courses: progress.courses || [progress] }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching data" });
    }
};

// --- TEST ROUTE (Keep this for debugging) ---
export const testEmailConnection = async (req, res) => {
    try {
        await transporter.sendMail({
            from: 'swarajcn774@gmail.com',
            to: 'swarajcn774@gmail.com',
            subject: "Test",
            text: "Working"
        });
        res.json({ success: true, message: "Email Sent!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};