import express from 'express';
import { 
    signup, 
    login, 
    getUserProgress, 
    testEmailConnection // Added this import
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Route for checking the email connection manually
router.get('/test-mail', testEmailConnection); 

// This matches app.use('/api/users', userRoutes) in server.js
router.get('/progress/:userId', getUserProgress);

export default router;