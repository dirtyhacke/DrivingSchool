import express from 'express';
import { getFullProfile, updateFullAccount, deleteAccount } from '../controllers/profileController.js';

const router = express.Router();
router.get('/:userId', getFullProfile);
router.post('/update-account', updateFullAccount);
router.delete('/:userId', deleteAccount);

export default router;