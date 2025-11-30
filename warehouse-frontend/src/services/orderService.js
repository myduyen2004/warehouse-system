import api from './api';

const orderService = {
  // Get all orders with pagination
  getAll: async (page = 0, size = 10) => {
    const response = await api.get(`/orders?page=${page}&size=${size}`);
    return response.data;
  },

  // Get order by ID
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create order
  create: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // Update order status
  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status?status=${status}`);
    return response.data;
  },

  // Cancel order
  cancel: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },
};

export default orderService;