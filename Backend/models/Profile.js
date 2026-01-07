import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  phoneNumber: { type: String, required: true },
  dob: { type: String, required: true }, // Added field
  address: { type: String, required: true },
  location: { type: String, required: true },
  profileImage: { type: String, default: "" }, 
  updatedAt: { type: Date, default: Date.now }
});

export const Profile = mongoose.model('Profile', profileSchema);