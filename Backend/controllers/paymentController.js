import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';

// 1. Global Payment Configuration - Get (for all users)
export const getPaymentConfig = async (req, res) => {
    try {
        // Get the global configuration (we'll use a special admin user or null userId)
        const globalConfig = await Payment.findOne({ 
            isGlobalConfig: true 
        }).sort({ updatedAt: -1 });
        
        if (!globalConfig) {
            // Create default config if doesn't exist
            const defaultConfig = new Payment({
                userId: new mongoose.Types.ObjectId(), // Create a dummy ID for admin
                studentName: 'Admin',
                adminUpiId: 'drivingschool@upi',
                adminPhone: '+91 9876543210',
                adminQrCode: '',
                paidAmount: 0,
                remainingAmount: 0,
                status: 'completed',
                vehicleCategory: 'LMV',
                isGlobalConfig: true, // Flag to identify global config
                isActive: true
            });
            await defaultConfig.save();
            return res.json({ success: true, config: defaultConfig });
        }
        
        res.json({ success: true, config: globalConfig });
    } catch (error) {
        console.error("❌ Get Config Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Global Payment Configuration - Update
export const updatePaymentConfig = async (req, res) => {
    try {
        const { 
            adminUpiId, 
            adminPhone, 
            existingQrUrl 
        } = req.body;
        
        let qrUrl = existingQrUrl || "";

        // Cloudinary Image Upload
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

        // Validate required fields
        if (!adminUpiId) {
            return res.status(400).json({ 
                success: false, 
                message: 'UPI ID is required' 
            });
        }

        // Create or update global configuration
        const globalConfig = await Payment.findOneAndUpdate(
            { isGlobalConfig: true },
            { 
                adminUpiId,
                adminPhone: adminPhone || '',
                adminQrCode: qrUrl,
                lastPaymentDate: new Date(),
                updatedAt: new Date(),
                isActive: true
            },
            { 
                upsert: true, // Create if doesn't exist
                new: true,
                setDefaultsOnInsert: {
                    userId: new mongoose.Types.ObjectId(),
                    studentName: 'Admin',
                    paidAmount: 0,
                    remainingAmount: 0,
                    status: 'completed',
                    vehicleCategory: 'LMV',
                    isGlobalConfig: true
                }
            }
        );

        res.json({ 
            success: true, 
            message: 'Payment configuration updated successfully',
            config: globalConfig 
        });
    } catch (error) {
        console.error("❌ Update Config Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get specific user's payment info (with global config fallback)
export const getStudentPayment = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }

        // Get user-specific payment first
        let payment = await Payment.findOne({ 
            userId, 
            isGlobalConfig: { $ne: true } 
        });
        
        // Always get global config for UPI/QR details
        const globalConfig = await Payment.findOne({ 
            isGlobalConfig: true,
            isActive: true 
        });
        
        // If no user-specific payment, return global config
        if (!payment) {
            return res.json({ 
                success: true, 
                payment: globalConfig || {},
                isUsingGlobal: true
            });
        }
        
        // Merge user-specific data with global UPI/QR details
        const mergedPayment = {
            ...payment.toObject(),
            adminUpiId: globalConfig?.adminUpiId || payment.adminUpiId,
            adminPhone: globalConfig?.adminPhone || payment.adminPhone,
            adminQrCode: globalConfig?.adminQrCode || payment.adminQrCode
        };
        
        res.json({ 
            success: true, 
            payment: mergedPayment,
            isUsingGlobal: !!globalConfig
        });
    } catch (error) {
        console.error("❌ Get Student Payment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Get all students with payment info
export const getPaymentUsers = async (req, res) => {
    try {
        const users = await User.find({ 
            role: { $regex: /^(user|student)$/i } 
        }, 'fullName email role phoneNumber');
        
        // Get all user payments
        const payments = await Payment.find({ 
            userId: { $in: users.map(u => u._id) },
            isGlobalConfig: { $ne: true }
        });
        
        // Merge user data with payment info
        const usersWithPayment = users.map(user => {
            const payment = payments.find(p => p.userId.toString() === user._id.toString());
            return {
                ...user.toObject(),
                paymentInfo: payment || null
            };
        });
        
        res.json({ success: true, users: usersWithPayment });
    } catch (error) {
        console.error("❌ Get Payment Users Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Get all payments (for admin view)
export const getAllPayments = async (req, res) => {
    try {
        // Get only user-specific payments, not global config
        const payments = await Payment.find({ 
            isGlobalConfig: { $ne: true } 
        })
            .sort({ updatedAt: -1 })
            .populate('userId', 'fullName email phoneNumber');
            
        // Get global config separately
        const globalConfig = await Payment.findOne({ 
            isGlobalConfig: true 
        });
        
        res.json({ 
            success: true, 
            payments,
            globalConfig: globalConfig || null
        });
    } catch (error) {
        console.error("❌ Get All Payments Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Update individual user payment status
export const updatePaymentStatus = async (req, res) => {
    try {
        const { 
            userId, 
            studentName, 
            paidAmount, 
            remainingAmount, 
            vehicleCategory 
        } = req.body;
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
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

        // Get global config to ensure UPI/QR is consistent
        const globalConfig = await Payment.findOne({ 
            isGlobalConfig: true 
        });

        const updatedPayment = await Payment.findOneAndUpdate(
            { 
                userId,
                isGlobalConfig: { $ne: true } // Don't update global config
            },
            { 
                userId, 
                studentName: studentName || 'Student',
                paidAmount: paid,
                remainingAmount: remaining,
                vehicleCategory: vehicleCategory || 'LMV',
                adminUpiId: globalConfig?.adminUpiId || 'drivingschool@upi',
                adminPhone: globalConfig?.adminPhone || '+91 9876543210',
                adminQrCode: globalConfig?.adminQrCode || '',
                status: calculatedStatus,
                lastPaymentDate: new Date(),
                updatedAt: new Date()
            },
            { 
                upsert: true, 
                new: true,
                setDefaultsOnInsert: {
                    isGlobalConfig: false
                }
            }
        );

        res.json({ 
            success: true, 
            message: 'Payment updated successfully',
            data: updatedPayment 
        });
    } catch (error) {
        console.error("❌ Update Payment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Get active global configuration (public endpoint for frontend)
export const getActivePaymentConfig = async (req, res) => {
    try {
        const config = await Payment.findOne({ 
            isGlobalConfig: true,
            isActive: true 
        });
        
        if (!config) {
            return res.status(404).json({ 
                success: false, 
                message: 'No active payment configuration found' 
            });
        }
        
        res.json({ 
            success: true, 
            config: {
                adminUpiId: config.adminUpiId,
                adminPhone: config.adminPhone,
                adminQrCode: config.adminQrCode,
                lastUpdated: config.updatedAt
            }
        });
    } catch (error) {
        console.error("❌ Get Active Config Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};