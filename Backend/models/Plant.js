// Backend/models/Plant.js
const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  capacity: { type: Number, required: true },
  phone: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    googleMapUrl: { type: String }
  },
  machineryAudit: { type: String },
  complianceDocUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);