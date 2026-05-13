import React, { useState } from 'react';
import { updateProduct, deleteProduct, createProduct } from '../api';

const Inventory = ({ products, setProducts, fetchAllData }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', stock: 0, unit: '', location: '' });

  const handleEdit = async (product) => {
    const newName = prompt('Edit Product Name:', product.name);
    if (!newName) return;
    const newSku = prompt('Edit SKU:', product.sku);
    const newUnit = prompt('Edit Unit:', product.unit);
    const newLocation = prompt('Edit Location:', product.location);
    const newStock = prompt('Edit Current Stock:', product.stock);
    
    const updated = {
      ...product,
      name: newName,
      sku: newSku,
      unit: newUnit,
      location: newLocation,
      stock: parseInt(newStock) || product.stock
    };
    
    try {
      await updateProduct(product._id, updated);
      await fetchAllData();
    } catch (error) {
      alert('Error updating product');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete product "${name}"? This will also delete all related requests and ledger entries.`)) {
      try {
        await deleteProduct(id);
        await fetchAllData();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({ name: '', sku: '', stock: 0, unit: '', location: '' });
      setShowAddForm(false);
      await fetchAllData();
    } catch (error) {
      alert('Error adding product');
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <i className="fas fa-boxes"></i> Product Inventory (Edit / Delete)
      </div>
      <div className="table-wrapper">
        <table id="inventoryTable">
          <thead>
            <tr>
              <th>ID</th><th>Product Name</th><th>SKU</th><th>Stock</th><th>Unit</th><th>Location</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p._id.slice(-6)}</td>
                <td><strong>{p.name}</strong></td>
                <td>{p.sku}</td>
                <td><span style={{ fontWeight: 700 }}>{p.stock}</span> {p.unit}</td>
                <td>{p.unit}</td>
                <td>{p.location}</td>
                <td>{p.stock <= 20 ? <span className="stock-warning"><i className="fas fa-exclamation-triangle"></i> LOW</span> : '✅ OK'}</td>
                <td>
                  <button className="action-btn" onClick={() => handleEdit(p)} style={{ color: '#2c7a5e' }}>
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button className="action-btn" onClick={() => handleDelete(p._id, p.name)} style={{ color: '#c44536' }}>
                    <i className="fas fa-trash"></i> Del
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showAddForm ? (
        <form onSubmit={handleAdd} style={{ marginTop: '1rem' }}>
          <div className="form-grid">
            <input type="text" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            <input type="text" placeholder="SKU" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} required />
            <input type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} required />
            <input type="text" placeholder="Unit" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} required />
            <input type="text" placeholder="Location" value={newProduct.location} onChange={e => setNewProduct({...newProduct, location: e.target.value})} required />
          </div>
          <button type="submit" className="btn-primary">Save Product</button>
          <button type="button" className="btn-primary" style={{ background: '#999', marginLeft: '10px' }} onClick={() => setShowAddForm(false)}>Cancel</button>
        </form>
      ) : (
        <button id="addProductBtn" className="btn-primary" style={{ background: '#3b7c5e', marginTop: '1rem' }} onClick={() => setShowAddForm(true)}>
          <i className="fas fa-plus"></i> Add New Product
        </button>
      )}
    </div>
  );
};

export default Inventory;