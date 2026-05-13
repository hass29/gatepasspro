import mongoose from "mongoose";

const ledgerEntrySchema = new mongoose.Schema({
  gatepassId: { type: mongoose.Schema.Types.ObjectId, ref: 'GatepassRequest', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  direction: { type: String, enum: ['inward', 'outward'], required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  applicant: { type: String, required: true },
  purpose: { type: String },
  unit: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('LedgerEntry', ledgerEntrySchema);