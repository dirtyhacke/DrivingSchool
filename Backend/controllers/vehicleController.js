/**
 * MAINTENANCE MODE CONTROLLER
 * All Playwright imports and automation logic removed.
 */

export const startDLSlotScraping = async (req, res) => {
    return res.status(503).json({ 
        success: false, 
        error: "SERVER_MAINTENANCE",
        message: "The Parivahan Automation Server is currently down for maintenance." 
    });
};

export const healthCheck = (req, res) => {
    res.json({ status: 'maintenance', message: 'Server Online (Maintenance Mode)' });
};

export const getVehicleDetails = (req, res) => res.status(503).json({ error: "Maintenance" });
export const testParivahanConnection = (req, res) => res.status(503).json({ connected: false });
export const getDLDetailsRealAPI = (req, res) => res.status(503).json({ error: "Maintenance" });
export const getRCDetailsRealAPI = (req, res) => res.status(503).json({ error: "Maintenance" });
export const getVehicleDetailsRealAPI = (req, res) => res.status(503).json({ error: "Maintenance" });

// EVERYTHING must be in this default export for the router to work
export default { 
    startDLSlotScraping, 
    healthCheck,
    getVehicleDetails,
    testParivahanConnection,
    getDLDetailsRealAPI,
    getRCDetailsRealAPI,
    getVehicleDetailsRealAPI
};