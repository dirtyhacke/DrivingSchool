import { SlotSettings } from '../models/SlotSettings.js';

// @desc    Get all slots
export const getAllSlots = async (req, res) => {
  try {
    const slots = await SlotSettings.find().sort({ date: -1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create or Update a slot (Upsert)
export const setSlotConfiguration = async (req, res) => {
  const { date, category, isClosed, modules } = req.body;

  try {
    // Find by date and update, or create if doesn't exist (upsert)
    const updatedSlot = await SlotSettings.findOneAndUpdate(
      { date },
      { category, isClosed, modules },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: isClosed ? "Date marked as CLOSED" : "Deployment Successful",
      data: updatedSlot
    });
  } catch (error) {
    res.status(400).json({ message: "Update Failed", error: error.message });
  }
};

// @desc    Delete a slot
export const deleteSlot = async (req, res) => {
  try {
    await SlotSettings.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Slot Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete Failed", error: error.message });
  }
};