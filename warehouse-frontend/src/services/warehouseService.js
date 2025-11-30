import api from './api';

const warehouseService = {
  // Get all warehouses
  getAll: async () => {
    const response = await api.get('/warehouses');
    return response.data;
  },

  // Get warehouse by ID
  getById: async (id) => {
    const response = await api.get(`/warehouses/${id}`);
    return response.data;
  },

  // Create warehouse
  create: async (data) => {
    const response = await api.post('/warehouses', data);
    return response.data;
  },

  // Update warehouse
  update: async (id, data) => {
    const response = await api.put(`/warehouses/${id}`, data);
    return response.data;
  },

  // Delete warehouse
  delete: async (id) => {
    const response = await api.delete(`/warehouses/${id}`);
    return response.data;
  },
};

export default warehouseService;