import React, { useState, useEffect } from 'react';
import './App.css';
import Inventory from './components/Inventory';
import ApplyGatepass from './components/ApplyGatepass';
import MyRequests from './components/MyRequests';
import Ledger from './components/Ledger';
import AdminPanel from './components/AdminPanel';
import { fetchProducts, fetchRequests, fetchStats } from './api';

function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalStock: 0, pendingApps: 0 });

  const fetchAllData = async () => {
    try {
      const [productsRes, requestsRes, statsRes] = await Promise.all([
        fetchProducts(),
        fetchRequests(),
        fetchStats()
      ]);
      setProducts(productsRes.data);
      setRequests(requestsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const tabs = [
    { id: 'inventory', label: 'Inventory', icon: 'fa-cubes' },
    { id: 'apply', label: 'Apply Gatepass', icon: 'fa-file-signature' },
    { id: 'requests', label: 'My Requests', icon: 'fa-clipboard-list' },
    { id: 'ledger', label: 'Stock Ledger 🔒', icon: 'fa-book' },
    { id: 'admin', label: 'Admin Panel', icon: 'fa-user-shield' }
  ];

  return (
    <div className="app-container">
      <div className="header">
        <div>
          <h1><i className="fas fa-warehouse"></i> Gatepass Pro</h1>
          <p>Inward • Outward | Full-page PDF | Edit/Delete Products</p>
        </div>
        <div className="stats">
          <div className="stat-card">
            <div className="number">{stats.totalProducts}</div>
            <div className="label">Products</div>
          </div>
          <div className="stat-card">
            <div className="number">{stats.totalStock}</div>
            <div className="label">Total Units</div>
          </div>
          <div className="stat-card">
            <div className="number">{stats.pendingApps}</div>
            <div className="label">Pending</div>
          </div>
        </div>
      </div>

      <div className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`fas ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'inventory' && <Inventory products={products} setProducts={setProducts} fetchAllData={fetchAllData} />}
      {activeTab === 'apply' && <ApplyGatepass products={products} fetchAllData={fetchAllData} />}
      {activeTab === 'requests' && <MyRequests requests={requests} />}
      {activeTab === 'ledger' && <Ledger products={products} />}
      {activeTab === 'admin' && <AdminPanel requests={requests} products={products} fetchAllData={fetchAllData} />}
    </div>
  );
}

export default App;