import express from 'express';
import { getVehicleDetails, getSafetyGuide } from '../controllers/vehicleController.js';

const router = express.Router();

router.get('/search', getVehicleDetails);
router.get('/guide', getSafetyGuide);

export default router;