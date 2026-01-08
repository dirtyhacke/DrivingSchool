import express from 'express';
import multer from 'multer';
import { 
    getPaymentUsers, 
    updatePaymentStatus, 
    getStudentPayment, 
    getAllPayments,
    getPaymentConfig,
    updatePaymentConfig,
    getActivePaymentConfig
} from '../controllers/paymentController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Global payment configuration endpoints
router.get('/config', getPaymentConfig); // Get global config (admin)
router.post('/config/update', upload.single('qrImage'), updatePaymentConfig); // Update global config (admin)
router.get('/config/active', getActivePaymentConfig); // Get active config (public)

// User payment management endpoints
router.get('/students', getPaymentUsers); 
router.get('/all', getAllPayments);
router.get('/student/:userId', getStudentPayment);
router.post('/update', upload.single('qrImage'), updatePaymentStatus);

export default router;