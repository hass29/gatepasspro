import  express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import productRoutes from './routes/products.js';
import  requestRoutes from './routes/requests.js';
import  ledgerRoutes from './routes/ledger.js';
import statsRoutes from './routes/stats.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/stats', statsRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});