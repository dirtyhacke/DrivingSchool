import express from 'express';
import multer from 'multer';
import { 
    getPaymentUsers, 
    updatePaymentStatus, 
    getStudentPayment, 
    getAllPayments 
} from '../controllers/paymentController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/students', getPaymentUsers); 
router.get('/all', getAllPayments);
router.get('/student/:userId', getStudentPayment);
router.post('/update', upload.single('qrImage'), updatePaymentStatus);

export default router;