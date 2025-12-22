import express from 'express';
import multer from 'multer';
import { activateReminder , getReminders ,deleteReminder} from '../controllers/reminderController.js';

const router = express.Router();

// Temporary storage for multer
const upload = multer({ dest: 'temp/' }); 

router.post('/activate', upload.single('document'), activateReminder);
router.get('/list', getReminders);
router.delete('/:id', deleteReminder);
export default router;