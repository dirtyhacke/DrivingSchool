import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  // Ensure this is exactly like this to link correctly to the User
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true // Prevents duplicate profiles for one user
  },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  location: { type: String, required: true },
  profileImage: { type: String, default: "" }, 
  updatedAt: { type: Date, default: Date.now }
});

export const Profile = mongoose.model('Profile', profileSchema);