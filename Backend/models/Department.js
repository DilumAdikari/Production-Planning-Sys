const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    division: {
      type: String,
      enum: ['Cutting', 'Sewing', 'Finishing', 'Packing', 'General'],
      default: 'Cutting'
    },
    inChargeName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', departmentSchema);