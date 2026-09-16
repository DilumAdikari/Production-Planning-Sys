const mongoose = require('mongoose');

const grnReceiptSchema = new mongoose.Schema(
  {
    grnNo: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    loadingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CutLoading',
      required: true
    },
    passedQty: {
      type: Number,
      required: true,
      min: 1
    },
    rejectedQty: {
      type: Number,
      default: 0
    },
    grnDate: {
      type: Date,
      default: Date.now
    },
    inspector: {
      type: String,
      required: true,
      trim: true
    },
    remarks: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('GrnReceipt', grnReceiptSchema);