import mongoose from 'mongoose';

const grnReceiptSchema = new mongoose.Schema({
  grnNo: { type: String, required: true, unique: true, uppercase: true },
  loadingId: { type: mongoose.Schema.Types.ObjectId, ref: 'CutLoading', required: true },
  passedQty: { type: Number, required: true },
  rejectedQty: { type: Number, default: 0 },
  grnDate: { type: Date, default: Date.now },
  inspector: { type: String, required: true },
  vehicleNo: { type: String },
  remarks: { type: String }
}, { timestamps: true });

export default mongoose.model('GrnReceipt', grnReceiptSchema);