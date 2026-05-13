import React from 'react';
import { generateGatepassPDF } from '../utils/pdfGenerator';

const MyRequests = ({ requests }) => {
  const getStatusClass = (status) => {
    if (status === 'approved') return 'status-approved';
    if (status === 'pending') return 'status-pending';
    return 'status-declined';
  };

  return (
    <div className="card">
      <div className="card-title">
        <i className="fas fa-ticket-alt"></i> My Gatepass Requests
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Product</th><th>Direction</th><th>Qty</th><th>Status</th><th>Date</th><th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id}>
                <td>#{req._id.slice(-6)}</td>
                <td>{req.productName}</td>
                <td>{req.direction === 'inward' ? '⬇️ INWARD' : '⬆️ OUTWARD'}</td>
                <td>{req.quantity}</td>
                <td><span className={`status-badge ${getStatusClass(req.status)}`}>{req.status}</span></td>
                <td>{new Date(req.datetime).toLocaleString()}</td>
                <td>
                  {req.status === 'approved' && (
                    <button className="action-btn" onClick={() => generateGatepassPDF(req)} style={{ color: '#2c7a5e' }}>
                      <i className="fas fa-download"></i> PDF
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>No requests found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyRequests;