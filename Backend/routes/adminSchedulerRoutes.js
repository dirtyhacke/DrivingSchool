import express from 'express';
import { getSchedulerUsers, updateAttendance } from '../controllers/adminSchedulerController.js';

const router = express.Router();

router.get('/users', getSchedulerUsers);
router.post('/update', updateAttendance);

export default router;