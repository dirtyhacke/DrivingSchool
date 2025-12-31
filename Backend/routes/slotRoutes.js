import express from 'express';
const router = express.Router();
import { 
  getAllSlots, 
  setSlotConfiguration, 
  deleteSlot 
} from '../controllers/slotController.js';

// Route: /api/slots
router.get('/', getAllSlots);
router.post('/configure', setSlotConfiguration);
router.delete('/:id', deleteSlot);

export default router;