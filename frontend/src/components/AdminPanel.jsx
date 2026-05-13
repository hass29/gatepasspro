import React, { useState } from 'react';
import { approveRequest, declineRequest, deleteRequest } from '../api';
import { generateGatepassPDF } from '../utils/pdfGenerator';

const AdminPanel = ({ requests, products, fetchAllData }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');

  const handleUnlock = () => {
    if (password === 'admin123') {
      setIsUnlocked(true);
    } else {
      alert('Wrong admin password! ');
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      await fetchAllData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error approving request');
    }
  };

  const handleDecline = async (id) => {
    try {
      await declineRequest(id);
      await fetchAllData();
    } catch (error) {
      alert('Error declining request');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this request? This will revert stock if approved.')) {
      try {
        await deleteRequest(id);
        await fetchAllData();
      } catch (error) {
        alert('Error deleting request');
      }
    }
  };

  const lowStockProducts = products.filter(p => p.stock <= 20);

  if (!isUnlocked) {
    return (
      <div className="card">
        <div className="card-title"><i className="fas fa-user-shield"></i> Admin Approval Panel</div>
        <div className="lock-area">
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px 20px', borderRadius: '60px', width: '240px', border: '1px solid #ccc' }} />
          <button onClick={handleUnlock} className="btn-primary" style={{ marginLeft: '10px' }}>Unlock</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title"><i className="fas fa-user-shield"></i> Admin Approval Panel</div>
      
      {lowStockProducts.length > 0 && (
        <div className="alert">
          <i className="fas fa-exclamation-triangle"></i> Low stock: {lowStockProducts.map(p => `${p.name} (${p.stock})`).join(', ')}
        </div>
      )}
      
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Applicant</th><th>Product</th><th>Dir</th><th>Qty</th><th>Status</th><th>Actions</th><th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id}>
                <td>{req._id.slice(-6)}</td>
                <td>{req.applicant}<br /><small>{req.phone}</small></td>
                <td>{req.productName}</td>
                <td>{req.direction.toUpperCase()}</td>
                <td>{req.quantity}</td>
                <td><span className={`status-badge status-${req.status}`}>{req.status}</span></td>
                <td>
                  {req.status === 'pending' && (
                    <>
                      <button className="action-btn" onClick={() => handleApprove(req._id)} style={{ color: '#2b7a4b' }}>
                        <i className="fas fa-check"></i> App
                      </button>
                      <button className="action-btn" onClick={() => handleDecline(req._id)} style={{ color: '#c44536' }}>
                        <i className="fas fa-times"></i> Decl
                      </button>
                    </>
                  )}
                  <button className="action-btn" onClick={() => handleDelete(req._id)} style={{ color: '#9e2d2d' }}>
                    <i className="fas fa-trash"></i> Del
                  </button>
                </td>
                <td>
                  {req.status === 'approved' && (
                    <button className="action-btn" onClick={() => generateGatepassPDF(req)}>
                      <i className="fas fa-file-pdf"></i> PDF
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan="8" style={{ textAlign: 'center' }}>No requests found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;