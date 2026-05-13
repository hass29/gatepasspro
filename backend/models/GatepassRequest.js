import mongoose from "mongoose";

const gatepassRequestSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  direction: { type: String, enum: ['inward', 'outward'], required: true },
  applicant: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  gate: { type: String, required: true },
  datetime: { type: Date, required: true },
  purpose: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  approvedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('GatepassRequest', gatepassRequestSchema);