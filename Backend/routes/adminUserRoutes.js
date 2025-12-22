import express from 'express';
import { getAllStudentDetails, terminateStudent } from '../controllers/adminUserController.js';

const router = express.Router();

router.get('/master-registry', getAllStudentDetails);
router.delete('/terminate/:id', terminateStudent);

export default router;