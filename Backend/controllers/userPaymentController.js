import { Payment } from '../models/Payment.js';

// Get payment details for the logged-in student
export const getMyPaymentDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find the record for this specific student
        const paymentRecord = await Payment.findOne({ userId });

        if (!paymentRecord) {
            return res.status(404).json({ 
                success: false, 
                message: "No payment ledger found for this user." 
            });
        }

        res.status(200).json({
            success: true,
            data: {
                studentName: paymentRecord.studentName,
                paidAmount: paymentRecord.paidAmount,
                remainingAmount: paymentRecord.remainingAmount,
                status: paymentRecord.status,
                vehicleCategory: paymentRecord.vehicleCategory,
                adminUpiId: paymentRecord.adminUpiId,
                adminPhone: paymentRecord.adminPhone,
                qrCode: paymentRecord.adminQrCode,
                lastUpdated: paymentRecord.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error fetching payments" });
    }
};