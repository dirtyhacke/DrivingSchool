import express from 'express';
import { signup, login, getUserProgress } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// This matches app.use('/api/users', userRoutes) in server.js
router.get('/progress/:userId', getUserProgress);

export default router;