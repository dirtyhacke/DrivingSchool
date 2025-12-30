import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';
import { Profile } from '../models/Profile.js';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';

// --- CLOUDINARY CONFIGURATION ---
cloudinary.config({
    cloud_name: 'your-cloud-name', 
    api_key: 'your-api-key', 
    api_secret: 'your-api-secret' 
});

// --- NODEMAILER CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sebastiannj@gmail.com',
        pass: 'ckeq gxyp ryiq zfyg' 
    }
});

// Helper Function: Send Admin Email Alert
const sendAdminAlert = async (newUser, profileData, imageUrl) => {
    const mailOptions = {
        from: '"Driving School Alert" <sebastiannj@gmail.com>',
        to: 'sebastiannj@gmail.com',
        subject: `🚀 New Student Joined: ${newUser.fullName}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px; background-color: white;">
                <h2 style="color: #2563eb; text-align: center;">New Student Registration</h2>
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="${imageUrl || 'https://via.placeholder.com/150'}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #2563eb;" />
                </div>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1;">
                    <p><strong>Full Name:</strong> ${newUser.fullName}</p>
                    <p><strong>Email:</strong> ${newUser.email}</p>
                    <p><strong>Phone:</strong> ${profileData.phoneNumber}</p>
                    <p><strong>Location:</strong> ${profileData.location}</p>
                    <p><strong>Address:</strong> ${profileData.address}</p>
                </div>
                <p style="font-size: 11px; color: #94a3b8; margin-top: 15px; text-align: center;">Timestamp: ${new Date().toLocaleString()}</p>
            </div>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Admin alert sent");
    } catch (err) {
        console.error("❌ Mail error:", err.message);
    }
};

// --- 1. SIGNUP CONTROLLER ---
export const signup = async (req, res) => {
    // Destructuring fields based on your Profile Schema
    const { fullName, email, password, profileImage, phoneNumber, address, location } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });

        // A. Upload Profile Image to Cloudinary
        let imageUrl = "";
        if (profileImage) {
            const uploadRes = await cloudinary.uploader.upload(profileImage, {
                folder: "driving_school_profiles",
            });
            imageUrl = uploadRes.secure_url;
        }

        // B. Create User
        const newUser = await User.create({ fullName, email, password, role: 'user' });

        // C. Create Profile (Matched to your Schema)
        const newProfile = await Profile.create({
            userId: newUser._id,
            phoneNumber: phoneNumber,
            address: address,
            location: location,
            profileImage: imageUrl
        });

        // D. Initialize Progress
        await Progress.create({
            userId: newUser._id,
            courses: [{
                vehicleType: 'four-wheeler',
                attendance: Array(1500).fill(0),
                gridRows: 30,
                gridCols: 50
            }]
        });

        // E. Trigger Email Alert
        sendAdminAlert(newUser, { phoneNumber, address, location }, imageUrl);
        
        res.status(201).json({ 
            success: true, 
            user: { _id: newUser._id, fullName: newUser.fullName, email: newUser.email },
            profile: newProfile
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: "Error creating account. Ensure all profile fields are provided." });
    }
};

// --- 2. LOGIN CONTROLLER ---
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

// --- 3. GET USER PROGRESS ---
export const getUserProgress = async (req, res) => {
    try {
        const { userId } = req.params;
        const progress = await Progress.findOne({ userId }).lean();
        const user = await User.findById(userId, 'fullName').lean();
        const profile = await Profile.findOne({ userId }).lean();

        if (!progress) return res.status(404).json({ success: false, message: "Data not found" });

        res.json({
            success: true,
            data: { 
                user: { ...user, profileImage: profile?.profileImage || "" }, 
                courses: progress.courses || [progress] 
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching data" });
    }
};

// --- 4. TEST EMAIL ROUTE ---
export const testEmailConnection = async (req, res) => {
    try {
        const info = await transporter.sendMail({
            from: 'swarajcn774@gmail.com',
            to: 'swarajcn774@gmail.com',
            subject: "Test Connection",
            text: "SMTP is working!"
        });
        res.json({ success: true, message: "Email Sent!", details: info.response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};