import Reminder from '../models/Reminder.js';
import cloudinary from '../config/cloudinary.js';

// 1. Existing function to save data
export const activateReminder = async (req, res) => {
  try {
    const { fullName, email, registrationNumber } = req.body;
    let documentUrl = "";

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "johns_driving_school/documents",
        resource_type: "auto"
      });
      documentUrl = uploadRes.secure_url;
    }

    const newReminder = new Reminder({
      fullName,
      email,
      registrationNumber,
      documentPath: documentUrl 
    });

    await newReminder.save();
    res.status(201).json({ 
      success: true, 
      message: "Pro Reminder activated via Cloudinary!" 
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ success: false, message: "Upload Failed", error: error.message });
  }
};

// 2. Function to fetch data
export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reminders
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 3. NEW DELETE FUNCTION
export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;

    // First, find the reminder to get the Cloudinary URL
    const reminder = await Reminder.findById(id);
    if (!reminder) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }

    // Optional: Delete image from Cloudinary if it exists
    if (reminder.documentPath) {
      try {
        // Extracts the public ID from the URL (e.g., johns_driving_school/documents/abc123)
        const publicId = reminder.documentPath.split('/').slice(-3).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryErr) {
        console.error("Cloudinary Delete Error (Skipping):", cloudinaryErr);
      }
    }

    // Delete from MongoDB
    await Reminder.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: "Reminder and associated document purged!" 
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};