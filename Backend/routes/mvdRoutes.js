// routes/vehicleRoutes.js - WITH REAL API INTEGRATION
import express from 'express';
import { 
    getVehicleDetails,
    getDLDetails,
    testConnection,
    bulkSearch,
    healthCheck,
    apiInfo,
    
    // NEW: Real API functions
    getVehicleDetailsRealAPI,
    getDLDetailsRealAPI,
    getRCDetailsRealAPI,
    testParivahanConnection
} from '../controllers/vehicleController.js';

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// API info
router.get('/info', apiInfo);

// Test connection to OUR server
router.get('/test', testConnection);

// Test connection to PARIVAHAN API
router.get('/test-parivahan', testParivahanConnection);

// ============================================
// REAL API ENDPOINTS
// ============================================

// REAL API: Vehicle details (same as web scraping but direct API)
router.get('/api/vehicle', getVehicleDetailsRealAPI);

// REAL API: DL details
router.get('/api/dl', getDLDetailsRealAPI);

// REAL API: RC details (from DatabaseHelper.J0 pattern)
router.get('/api/rc/:rcNumber', getRCDetailsRealAPI);

// ============================================
// YOUR EXISTING ENDPOINTS (keep for compatibility)
// ============================================

// Simulated/search endpoints (your existing)
router.get('/search', getVehicleDetails);  // For vehicle/RC (simulated)
router.get('/dl', getDLDetails);           // For DL (simulated)
router.post('/bulk', bulkSearch);          // Bulk search (simulated)

// ============================================
// HYBRID ENDPOINT (tries real API first, falls back)
// ============================================

router.get('/hybrid/search', async (req, res) => {
    const { first, second, state = 'KL', rto = '60' } = req.query;
    
    if (!first || !second) {
        return res.status(400).json({ 
            error: 'Missing registration parts',
            example: '/api/vehicle/hybrid/search?first=KL&second=60AB1234'
        });
    }
    
    const fullReg = `${first}${second}`.toUpperCase();
    
    try {
        console.log(`🔍 Hybrid search for: ${fullReg}`);
        
        // Try real API first
        try {
            const realResult = await getVehicleDetailsRealAPI(
                { query: { reg: fullReg, state, rto } }, 
                { json: () => {} }
            );
            
            if (realResult && realResult.success) {
                return res.json({
                    source: 'real-parivahan-api',
                    registration: fullReg,
                    ...realResult
                });
            }
        } catch (apiError) {
            console.log('Real API failed, falling back to simulated:', apiError.message);
        }
        
        // Fallback to simulated
        const simulatedResult = await getVehicleDetails(req, res, true);
        return res.json({
            source: 'simulated-fallback',
            registration: fullReg,
            ...simulatedResult
        });
        
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            registration: fullReg
        });
    }
});

// ============================================
// BULK REAL API SEARCH
// ============================================

router.post('/api/bulk', async (req, res) => {
    const { registrations = [], state = 'KL', rto = '60', type = 'vehicle' } = req.body;
    
    if (!Array.isArray(registrations) || registrations.length === 0) {
        return res.status(400).json({ 
            error: 'Array of registration numbers required',
            example: '{"registrations": ["KL60AB1234"], "state": "KL", "rto": "60"}'
        });
    }
    
    console.log(`📦 Bulk real API search for ${registrations.length} vehicles`);
    
    const results = [];
    const limit = Math.min(registrations.length, 5); // Limit to 5 for real API
    
    for (let i = 0; i < limit; i++) {
        const reg = registrations[i];
        
        try {
            let apiResult;
            
            if (type === 'dl') {
                // For DL searches, you'd need DOB - you might need to modify this
                apiResult = { 
                    success: false, 
                    error: 'DL bulk search requires DOB for each entry' 
                };
            } else {
                // For vehicle/RC searches
                apiResult = await getVehicleDetailsRealAPI(
                    { query: { reg, state, rto } },
                    { json: () => {} }
                );
            }
            
            results.push({
                registration: reg,
                index: i + 1,
                ...apiResult
            });
            
            // Delay between requests to avoid rate limiting
            if (i < limit - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
        } catch (error) {
            results.push({
                registration: reg,
                success: false,
                error: error.message
            });
        }
    }
    
    return res.json({
        success: true,
        totalRequested: registrations.length,
        processed: results.length,
        apiLimit: 'Limited to 5 requests per call (rate limiting)',
        results: results,
        timestamp: new Date().toISOString()
    });
});

// ============================================
// ROOT ENDPOINT (updated)
// ============================================

router.get('/', (req, res) => {
    res.json({
        service: 'Vehicle & RC Verification API',
        version: '2.0',
        description: 'Now with REAL Parivahan API integration',
        endpoints: {
            // Real API endpoints
            'GET  /api/vehicle?reg=KL60AB1234&state=KL&rto=60': 'Real Parivahan API (Vehicle)',
            'GET  /api/dl?dl=KL6020190012345&dob=01-01-1990': 'Real Parivahan API (DL)',
            'GET  /api/rc/:rcNumber': 'Real Parivahan API (RC Details)',
            
            // Hybrid endpoints
            'GET  /hybrid/search?first=KL&second=60AB1234': 'Hybrid (Real API + Fallback)',
            
            // Bulk operations
            'POST /api/bulk': 'Bulk search with real API',
            'POST /bulk': 'Simulated bulk search',
            
            // Test endpoints
            'GET  /test': 'Test server connection',
            'GET  /test-parivahan': 'Test Parivahan API connection',
            
            // Simulated endpoints (for testing)
            'GET  /search?first=KL&second=60AB1234': 'Simulated vehicle search',
            'GET  /dl?dl=KL6020190012345&dob=01-01-1990': 'Simulated DL search'
        },
        notes: [
            'Real API endpoints connect directly to Parivahan.gov.in',
            'Simulated endpoints return test data (no API calls)',
            'Hybrid endpoints try real API first, fallback to simulated'
        ]
    });
});

export default router;