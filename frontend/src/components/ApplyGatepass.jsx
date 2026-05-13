import React, { useState, useEffect } from 'react';
import { createRequest } from '../api';

const ApplyGatepass = ({ products, fetchAllData }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    direction: 'inward',
    applicant: '',
    phone: '',
    email: '',
    gate: 'Gate 1',
    datetime: new Date().toISOString().slice(0, 16),
    purpose: ''
  });
  const [message, setMessage] = useState('');
  const [stockAlert, setStockAlert] = useState('');

  const selectedProduct = products.find(p => p._id === formData.productId);

  useEffect(() => {
    if (formData.direction === 'outward' && selectedProduct && selectedProduct.stock <= 20) {
      setStockAlert(`⚠️ Low stock (${selectedProduct.stock} ${selectedProduct.unit}). Outward may be blocked if quantity exceeds.`);
    } else {
      setStockAlert('');
    }
  }, [formData.direction, formData.productId, selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.direction === 'outward' && selectedProduct && selectedProduct.stock < formData.quantity) {
      setMessage(`❌ Cannot submit: Only ${selectedProduct.stock} ${selectedProduct.unit} available.`);
      return;
    }
    
    try {
      await createRequest(formData);
      setMessage('✅ Request submitted! Awaiting approval.');
      setFormData({
        ...formData,
        productId: '',
        quantity: 1,
        applicant: '',
        phone: '',
        email: '',
        purpose: '',
        datetime: new Date().toISOString().slice(0, 16)
      });
      await fetchAllData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting request');
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <i className="fas fa-exchange-alt"></i> Apply Inward / Outward Gatepass
      </div>
      {stockAlert && <div className="alert">{stockAlert}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label>Applicant Name *</label>
            <input type="text" value={formData.applicant} onChange={e => setFormData({...formData, applicant: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Phone *</label>
            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Email *</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Select Product *</label>
            <select value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} required>
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} (Stock: {p.stock} {p.unit}) {p.stock <= 20 ? '⚠️ Low' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Quantity *</label>
            <input type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} required />
          </div>
          <div className="input-group">
            <label>Gate No.</label>
            <select value={formData.gate} onChange={e => setFormData({...formData, gate: e.target.value})}>
              <option>Gate 1</option><option>Gate 2</option><option>Gate 3</option><option>Gate 4</option>
            </select>
          </div>
          <div className="input-group">
            <label>Date & Time</label>
            <input type="datetime-local" value={formData.datetime} onChange={e => setFormData({...formData, datetime: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Direction</label>
            <div className="direction-group">
              <span>
                <input type="radio" name="direction" value="inward" checked={formData.direction === 'inward'} onChange={e => setFormData({...formData, direction: e.target.value})} />
                <label>📥 INWARD</label>
              </span>
              <span>
                <input type="radio" name="direction" value="outward" checked={formData.direction === 'outward'} onChange={e => setFormData({...formData, direction: e.target.value})} />
                <label>📤 OUTWARD</label>
              </span>
            </div>
          </div>
          <div className="input-group">
            <label>Purpose / Reference</label>
            <textarea rows="2" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} placeholder="PO / Invoice / Return"></textarea>
          </div>
        </div>
        <button type="submit" className="btn-primary"><i className="fas fa-paper-plane"></i> Submit Request</button>
      </form>
      {message && <div className="alert" style={{ background: message.includes('✅') ? '#e0f2e9' : '#ffe6e5', marginTop: '1rem' }}>{message}</div>}
    </div>
  );
};

export default ApplyGatepass;