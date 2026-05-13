import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

// Products
export const fetchProducts = () => API.get('/products');
export const createProduct = (product) => API.post('/products', product);
export const updateProduct = (id, product) => API.put(`/products/${id}`, product);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Requests
export const fetchRequests = () => API.get('/requests');
export const createRequest = (request) => API.post('/requests', request);
export const approveRequest = (id) => API.put(`/requests/${id}/approve`);
export const declineRequest = (id) => API.put(`/requests/${id}/decline`);
export const deleteRequest = (id) => API.delete(`/requests/${id}`);

// Ledger
export const fetchLedger = (filters) => API.get('/ledger', { params: filters });

// Stats
export const fetchStats = () => API.get('/stats');

export default API;