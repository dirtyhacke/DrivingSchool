import express from 'express';
import { saveLicenseDetails, getLicenseDetails,deleteLicenseDetails } from '../controllers/licenseDetailsController.js';

const router = express.Router();

router.post('/store', saveLicenseDetails);
router.get('/list', getLicenseDetails);
router.delete('/:id', deleteLicenseDetails);

export default router;