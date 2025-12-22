import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  registrationNumber: { type: String, required: true, uppercase: true },
  documentPath: { type: String }, // Stores Cloudinary Secure URL
  status: { type: String, default: 'active' }
}, { timestamps: true });

export default mongoose.model('Reminder', ReminderSchema);