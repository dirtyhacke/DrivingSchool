import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';
import { Profile } from '../models/Profile.js';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';

/* ---------------- CLOUDINARY CONFIG ---------------- */
cloudinary.config({
    cloud_name: 'your-cloud-name',
    api_key: 'your-api-key',
    api_secret: 'your-api-secret'
});

/* ---------------- MAIL CONFIG ---------------- */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sebastiannj@gmail.com',
        pass: 'ckeq gxyp ryiq zfyg'
    }
});

/* ---------------- EMAIL ALERT ---------------- */
const sendAdminAlert = async (newUser, profileData, imageUrl) => {
    try {
        await transporter.sendMail({
            from: '"Driving School Alert" <sebastiannj@gmail.com>',
            to: 'sebastiannj@gmail.com',
            subject: `🚀 New Student Joined: ${newUser.fullName}`,
            html: `
                <h3>New Student Registered</h3>
                <img src="${imageUrl}" width="100"/>
                <p><b>Name:</b> ${newUser.fullName}</p>
                <p><b>Email:</b> ${newUser.email}</p>
                <p><b>Phone:</b> ${profileData.phoneNumber}</p>
                <p><b>Location:</b> ${profileData.location}</p>
                <p><b>Address:</b> ${profileData.address}</p>
                <small>${new Date().toLocaleString()}</small>
            `
        });
    } catch (err) {
        console.error("Mail Error:", err.message);
    }
};

/* ====================================================
   🔐 SIGNUP — FULLY LOCKED (NO BYPASS POSSIBLE)
==================================================== */
export const signup = async (req, res) => {

    const {
        fullName,
        email,
        password,
        phoneNumber,
        address,
        location,
        profileImage
    } = req.body;

    /* ---------- HARD VALIDATION ---------- */
    if (
        !fullName?.trim() ||
        !email?.trim() ||
        !password?.trim() ||
        !phoneNumber?.trim() ||
        !address?.trim() ||
        !location?.trim() ||
        !profileImage
    ) {
        return res.status(400).json({
            success: false,
            message: "ALL fields including profile photo are mandatory"
        });
    }

    /* ---------- EXTRA SANITY CHECKS ---------- */
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

    if (phoneNumber.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Invalid phone number"
        });
    }

    try {
        /* ---------- EMAIL DUPLICATE ---------- */
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        /* ---------- IMAGE UPLOAD (REQUIRED) ---------- */
        let imageUrl;
        try {
            const uploadRes = await cloudinary.uploader.upload(profileImage, {
                folder: "driving_school_profiles"
            });
            imageUrl = uploadRes.secure_url;
        } catch {
            return res.status(400).json({
                success: false,
                message: "Profile image upload failed"
            });
        }

        /* ---------- CREATE USER ---------- */
        const newUser = await User.create({
            fullName,
            email,
            password,
            role: 'user'
        });

        /* ---------- CREATE PROFILE ---------- */
        const newProfile = await Profile.create({
            userId: newUser._id,
            phoneNumber,
            address,
            location,
            profileImage: imageUrl
        });

        /* ---------- INIT PROGRESS ---------- */
        await Progress.create({
            userId: newUser._id,
            courses: [{
                vehicleType: 'four-wheeler',
                attendance: Array(1500).fill(0),
                gridRows: 30,
                gridCols: 50
            }]
        });

        /* ---------- ADMIN ALERT ---------- */
        sendAdminAlert(newUser, { phoneNumber, address, location }, imageUrl);

        res.status(201).json({
            success: true,
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({
            success: false,
            message: "Account creation failed"
        });
    }
};

/* ====================================================
   🔐 LOGIN (UNCHANGED LOGIC)
==================================================== */
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password required"
        });
    }

    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

/* ====================================================
   GET USER PROGRESS
==================================================== */
export const getUserProgress = async (req, res) => {
    try {
        const { userId } = req.params;

        const progress = await Progress.findOne({ userId }).lean();
        const user = await User.findById(userId, 'fullName').lean();
        const profile = await Profile.findOne({ userId }).lean();

        if (!progress) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }

        res.json({
            success: true,
            data: {
                user: { ...user, profileImage: profile?.profileImage || "" },
                courses: progress.courses
            }
        });

    } catch {
        res.status(500).json({
            success: false,
            message: "Error fetching data"
        });
    }
};

/* ====================================================
   TEST EMAIL
==================================================== */
export const testEmailConnection = async (req, res) => {
    try {
        const info = await transporter.sendMail({
            from: 'sebastiannj@gmail.com',
            to: 'sebastiannj@gmail.com',
            subject: "Test Email",
            text: "SMTP working!"
        });
        res.json({ success: true, info: info.response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
