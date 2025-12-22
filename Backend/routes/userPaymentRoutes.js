import express from 'express';
import { getMyPaymentDetails } from '../controllers/userPaymentController.js';

const router = express.Router();

// Route for students to see their own status
router.get('/my-status/:userId', getMyPaymentDetails);

export default router;