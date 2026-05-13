import Product from '../models/Product.js';
import GatepassRequest from '../models/GatepassRequest.js';

const getStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const products = await Product.find();
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const pendingApps = await GatepassRequest.countDocuments({ status: 'pending' });
    
    res.json({ totalProducts, totalStock, pendingApps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getStats };