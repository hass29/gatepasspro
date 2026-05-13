import React, { useState, useEffect } from 'react';
import { fetchLedger } from '../api';
import { generateGatepassPDF } from '../utils/pdfGenerator';

const Ledger = ({ products }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [ledgerData, setLedgerData] = useState({ entries: [], summary: { totalIn: 0, totalOut: 0, net: 0 } });
  const [filters, setFilters] = useState({ productId: 'all', direction: 'all', fromDate: '', toDate: '' });

  useEffect(() => {
    if (isUnlocked) {
      const loadLedger = async () => {
        try {
          const res = await fetchLedger(filters);
          setLedgerData(res.data);
        } catch (error) {
          console.error('Error loading ledger:', error);
        }
      };
      loadLedger();
    }
  }, [isUnlocked, filters]); // dependencies are correct now

  const handleUnlock = () => {
    if (password === 'ledger2025') {
      setIsUnlocked(true);
    } else {
      alert('Wrong password! ');
    }
  };

  if (!isUnlocked) {
    return (
      <div className="card">
        <div className="card-title"><i className="fas fa-book"></i> Stock Movement Ledger 🔒</div>
        <div className="lock-area">
          <i className="fas fa-lock" style={{ fontSize: '2.5rem', color: '#2c7a5e' }}></i>
          <p style={{ margin: '1rem 0' }}>
            <strong>🔐 Secure Ledger Access</strong><br />
             
          </p>
          <input type="password" placeholder="Enter ledger password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px 20px', borderRadius: '60px', width: '240px', border: '1px solid #ccc' }} />
          <button onClick={handleUnlock} className="btn-primary" style={{ marginLeft: '10px' }}>Unlock</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title"><i className="fas fa-book"></i> Stock Movement Ledger 🔓</div>
      
      <div className="ledger-filters">
        <select value={filters.productId} onChange={e => setFilters({...filters, productId: e.target.value})}>
          <option value="all">All Products</option>
          {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select value={filters.direction} onChange={e => setFilters({...filters, direction: e.target.value})}>
          <option value="all">All Directions</option>
          <option value="inward">Inward</option>
          <option value="outward">Outward</option>
        </select>
        <input type="date" value={filters.fromDate} onChange={e => setFilters({...filters, fromDate: e.target.value})} placeholder="From Date" />
        <input type="date" value={filters.toDate} onChange={e => setFilters({...filters, toDate: e.target.value})} placeholder="To Date" />
        <button onClick={() => setFilters({ productId: 'all', direction: 'all', fromDate: '', toDate: '' })} style={{ background: '#2c7a5e', color: 'white', border: 'none', padding: '6px 20px', borderRadius: '40px' }}>
          <i className="fas fa-sync-alt"></i> Reset
        </button>
      </div>
      
      <div className="summary-card">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span><i className="fas fa-chart-line"></i> Summary</span>
          <span>
            📥 Inward: {ledgerData.summary.totalIn} | 📤 Outward: {ledgerData.summary.totalOut} | Net: {ledgerData.summary.net}
          </span>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Gatepass ID</th><th>Product</th><th>Direction</th><th>Qty In</th><th>Qty Out</th><th>Balance</th><th>Applicant</th><th>Purpose</th><th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {ledgerData.entries.map(entry => (
              <tr key={entry._id}>
                <td>{new Date(entry.date).toLocaleString()}</td>
                <td>GP-{entry.gatepassId?.slice(-6)}</td>
                <td>{entry.productName}</td>
                <td>{entry.direction === 'inward' ? <span className="inward-text">⬇️ INWARD</span> : <span className="outward-text">⬆️ OUTWARD</span>}</td>
                <td>{entry.direction === 'inward' ? entry.quantity : '-'}</td>
                <td>{entry.direction === 'outward' ? entry.quantity : '-'}</td>
                <td><strong>{entry.balance} {entry.unit}</strong></td>
                <td>{entry.applicant}</td>
                <td>{entry.purpose || '—'}</td>
                <td>
                  <button className="action-btn" onClick={() => generateGatepassPDF({ ...entry, _id: entry.gatepassId })} style={{ background: '#eef2f0', borderRadius: '40px' }}>
                    <i className="fas fa-file-pdf"></i> PDF
                  </button>
                </td>
              </tr>
            ))}
            {ledgerData.entries.length === 0 && (
              <tr><td colSpan="10" style={{ textAlign: 'center' }}>No ledger entries</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ledger;