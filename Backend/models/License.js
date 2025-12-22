import mongoose from 'mongoose';

const LicenseSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  primaryMobile: { type: String, required: true },
  secondaryMobile: { type: String, default: '' },
  licenseNumber: { type: String, required: true, unique: true, uppercase: true },
  lmvValidity: { type: Date },
  twoWheelerValidity: { type: Date },
  erikshaValidity: { type: Date },
  hmvValidity: { type: Date },
  miscValidity: { type: Date }
}, { 
  timestamps: true,
  collection: 'licensedetails' 
});

export default mongoose.model('License', LicenseSchema);