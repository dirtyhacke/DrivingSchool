import mongoose from 'mongoose';

const slotSettingsSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  isClosed: { type: Boolean, default: false },
  modules: {
    type: Map,
    of: new mongoose.Schema({
      active: { type: Boolean, default: false },
      start: { type: String },
      end: { type: String },
      capacity: { type: Number, default: 20 } // New Capacity Field
    }, { _id: false })
  }
}, { timestamps: true });

export const SlotSettings = mongoose.model('SlotSettings', slotSettingsSchema);