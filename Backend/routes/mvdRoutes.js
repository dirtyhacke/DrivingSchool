import express from 'express';
// Ensure this path exactly matches your folder structure
import vehicleController from '../controllers/vehicleController.js';

const router = express.Router();

/**
 * @section 1. AUTOMATION / SCRAPING ROUTES
 * These routes are currently redirected to Maintenance Handlers.
 */

// POST: http://localhost:8080/api/vehicle/book-slot
router.post('/book-slot', vehicleController.startDLSlotScraping);


/**
 * @section 2. REAL API & DATA ROUTES
 * High-performance routes for fetching DL/RC/Vehicle data.
 */

// GET: http://localhost:8080/api/vehicle/real-data
router.get('/real-data', vehicleController.getVehicleDetailsRealAPI);

// GET: http://localhost:8080/api/vehicle/dl-data
router.get('/dl-data', vehicleController.getDLDetailsRealAPI);

// GET: http://localhost:8080/api/vehicle/rc/:rcNumber
router.get('/rc/:rcNumber', vehicleController.getRCDetailsRealAPI);


/**
 * @section 3. SYSTEM UTILITIES
 * Monitoring and connection testing.
 */

// GET: http://localhost:8080/api/vehicle/health
router.get('/health', vehicleController.healthCheck);

// GET: http://localhost:8080/api/vehicle/test-parivahan
router.get('/test-parivahan', vehicleController.testParivahanConnection);

// GET: http://localhost:8080/api/vehicle/search
router.get('/search', vehicleController.getVehicleDetails);


export default router;