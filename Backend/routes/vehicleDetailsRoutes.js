import express from 'express';
import { saveVehicleDetails, getVehicleDetails,deleteVehicleDetails } from '../controllers/vehicleDetailsController.js';

const router = express.Router();

router.post('/store', saveVehicleDetails);
router.get('/list', getVehicleDetails);
router.delete('/:id', deleteVehicleDetails);
export default router;