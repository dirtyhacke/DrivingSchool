import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true, uppercase: true },
  ownerName: { type: String, required: true },
  primaryMobile: { type: String, required: true },
  secondaryMobile: { type: String, default: '' },
  regValidity: { type: Date, required: true },
  insuranceValidity: { type: Date, required: true },
  pollutionValidity: { type: Date, required: true },
  permitValidity: { type: Date, required: true }
}, { 
  timestamps: true,
  collection: 'vehiclefrom' 
});

export default mongoose.model('Vehicle', VehicleSchema);