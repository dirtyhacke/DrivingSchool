import License from '../models/License.js';

export const saveLicenseDetails = async (req, res) => {
  try {
    const existing = await License.findOne({ licenseNumber: req.body.licenseNumber });
    if (existing) {
      return res.status(400).json({ success: false, message: "License Number already exists in records" });
    }

    const licenseEntry = new License(req.body);
    await licenseEntry.save();
    
    res.status(201).json({ success: true, message: "License details stored successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const getLicenseDetails = async (req, res) => {
  try {
    const data = await License.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

// ADD THIS NEW DELETE FUNCTION
export const deleteLicenseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await License.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ success: false, message: "License record not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "License record purged successfully" 
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Delete operation failed" });
  }
};