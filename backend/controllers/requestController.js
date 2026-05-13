import GatepassRequest from '../models/GatepassRequest.js';
import Product from '../models/Product.js';
import LedgerEntry from '../models/LedgerEntry.js';

// Get all requests
const getRequests = async (req, res) => {
  try {
    const requests = await GatepassRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create request
const createRequest = async (req, res) => {
  try {
    const { productId, quantity, direction } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (direction === 'outward' && product.stock < quantity) {
      return res.status(400).json({ message: `Insufficient stock! Only ${product.stock} ${product.unit} available.` });
    }
    
    const request = new GatepassRequest({
      ...req.body,
      productName: product.name,
      datetime: req.body.datetime || new Date()
    });
    
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Approve request
const approveRequest = async (req, res) => {
  try {
    const request = await GatepassRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }
    
    const product = await Product.findById(request.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    // Check stock for outward
    if (request.direction === 'outward' && product.stock < request.quantity) {
      return res.status(400).json({ message: `Insufficient stock! Only ${product.stock} ${product.unit} available.` });
    }
    
    // Update stock
    if (request.direction === 'inward') {
      product.stock += request.quantity;
    } else {
      product.stock -= request.quantity;
    }
    await product.save();
    
    // Update request status
    request.status = 'approved';
    request.approvedAt = new Date();
    await request.save();
    
    // Create ledger entry
    const ledgerEntry = new LedgerEntry({
      gatepassId: request._id,
      productId: product._id,
      productName: product.name,
      direction: request.direction,
      quantity: request.quantity,
      date: new Date(),
      applicant: request.applicant,
      purpose: request.purpose,
      unit: product.unit
    });
    await ledgerEntry.save();
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Decline request
const declineRequest = async (req, res) => {
  try {
    const request = await GatepassRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    request.status = 'declined';
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete request (with stock revert if approved)
const deleteRequest = async (req, res) => {
  try {
    const request = await GatepassRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    if (request.status === 'approved') {
      const product = await Product.findById(request.productId);
      if (product) {
        // Revert stock
        if (request.direction === 'inward') {
          product.stock -= request.quantity;
        } else {
          product.stock += request.quantity;
        }
        await product.save();
      }
      // Delete ledger entry
      await LedgerEntry.findOneAndDelete({ gatepassId: request._id });
    }
    
    await GatepassRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getRequests, createRequest, approveRequest, declineRequest, deleteRequest };