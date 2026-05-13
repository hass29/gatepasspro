import Product from '../models/Product.js';
import GatepassRequest from '../models/GatepassRequest.js';
import LedgerEntry from '../models/LedgerEntry.js';

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after'});
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product & cascade related requests/ledger
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Find all requests for this product
    const requests = await GatepassRequest.find({ productId: product._id });
    
    // For approved requests, revert stock (but product is being deleted, so just remove)
    // Delete all related ledger entries
    await LedgerEntry.deleteMany({ productId: product._id });
    await GatepassRequest.deleteMany({ productId: product._id });
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product and all related data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getProducts, createProduct, updateProduct, deleteProduct };