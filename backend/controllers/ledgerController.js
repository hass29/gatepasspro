import LedgerEntry from '../models/LedgerEntry.js';
import Product from '../models/Product.js';

const getLedgerEntries = async (req, res) => {
  try {
    const { productId, direction, fromDate, toDate } = req.query;
    let filter = {};
    
    if (productId && productId !== 'all') {
      filter.productId = productId;
    }
    if (direction && direction !== 'all') {
      filter.direction = direction;
    }
    if (fromDate) {
      filter.date = { ...filter.date, $gte: new Date(fromDate) };
    }
    if (toDate) {
      filter.date = { ...filter.date, $lte: new Date(toDate) };
    }
    
    const entries = await LedgerEntry.find(filter).sort({ date: 1 });
    
    // Calculate running balance
    let balanceMap = {};
    const entriesWithBalance = entries.map(entry => {
      if (!balanceMap[entry.productId]) balanceMap[entry.productId] = 0;
      if (entry.direction === 'inward') {
        balanceMap[entry.productId] += entry.quantity;
      } else {
        balanceMap[entry.productId] -= entry.quantity;
      }
      return {
        ...entry.toObject(),
        balance: balanceMap[entry.productId]
      };
    });
    
    // Calculate summary
    const totalIn = entries.filter(e => e.direction === 'inward').reduce((sum, e) => sum + e.quantity, 0);
    const totalOut = entries.filter(e => e.direction === 'outward').reduce((sum, e) => sum + e.quantity, 0);
    
    res.json({
      entries: entriesWithBalance,
      summary: { totalIn, totalOut, net: totalIn - totalOut }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getLedgerEntries };