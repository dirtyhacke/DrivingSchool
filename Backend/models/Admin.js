import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, default: 'admin' },
  password: { type: String, default: 'admin@123' },
  secretKey: { type: String, default: '1234567' } // Non-changeable via UI
});

export const Admin = mongoose.model('Admin', adminSchema);