import express from 'express';
import { adminLogin, verifySecret, updateAdminConfig, verifySession } from '../controllers/adminAuthController.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/verify-session', verifySession);
router.post('/verify-secret', verifySecret);
router.post('/update', updateAdminConfig);

export default router;