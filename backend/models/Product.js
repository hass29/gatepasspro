import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true },
  location: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);