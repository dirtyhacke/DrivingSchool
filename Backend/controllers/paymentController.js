import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// 1. Fetch Students for the Dropdown
export const getPaymentUsers = async (req, res) => {
    try {
        let users = await User.find({ 
            role: { $regex: /^(user|student)$/i } 
        }, 'fullName email role');

        if (users.length === 0) {
            users = await User.find({}, 'fullName email role');
        }
        
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Update/Sync Payment with Automatic Status, Vehicle Category & Date
export const updatePaymentStatus = async (req, res) => {
    try {
        // Added vehicleCategory to the destructured body
        const { 
            userId, 
            studentName, 
            paidAmount, 
            remainingAmount, 
            upiId, 
            phone, 
            vehicleCategory 
        } = req.body;
        
        let qrUrl = req.body.existingQrUrl || "";

        // Cloudinary Image Stream
        if (req.file) {
            const uploadPromise = new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'driving_school_payments' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                stream.end(req.file.buffer);
            });
            qrUrl = await uploadPromise;
        }

        // --- DYNAMIC STATUS LOGIC ---
        const paid = Number(paidAmount) || 0;
        const remaining = Number(remainingAmount) || 0;
        
        let calculatedStatus = 'pending';
        if (remaining <= 0 && paid > 0) {
            calculatedStatus = 'completed';
        } else if (paid > 0) {
            calculatedStatus = 'partial';
        }

        const updatedPayment = await Payment.findOneAndUpdate(
            { userId },
            { 
                userId, 
                studentName, 
                adminQrCode: qrUrl,
                paidAmount: paid,
                remainingAmount: remaining,
                vehicleCategory: vehicleCategory || 'LMV', // Updates category in DB
                adminUpiId: upiId, 
                adminPhone: phone, 
                status: calculatedStatus,
                lastPaymentDate: new Date() 
            },
            { upsert: true, new: true }
        );

        res.json({ success: true, data: updatedPayment });
    } catch (error) {
        console.error("❌ Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Fetch All Ledger Records
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ updatedAt: -1 });
        res.json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Student fetch
export const getStudentPayment = async (req, res) => {
    try {
        const payment = await Payment.findOne({ userId: req.params.userId });
        res.json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};