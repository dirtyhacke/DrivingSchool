import Vehicle from '../models/Vehicle.js';

export const saveVehicleDetails = async (req, res) => {
  try {
    const existing = await Vehicle.findOne({ registrationNumber: req.body.registrationNumber });
    if (existing) {
      return res.status(400).json({ success: false, message: "Registration Number already exists" });
    }

    const vehicleEntry = new Vehicle(req.body);
    await vehicleEntry.save();
    
    res.status(201).json({ success: true, message: "Vehicle details stored successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const getVehicleDetails = async (req, res) => {
  try {
    const data = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

// ADD THIS NEW DELETE FUNCTION
export const deleteVehicleDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Vehicle record purged successfully" 
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Server Error during deletion" });
  }
};