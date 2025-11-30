import api from './api';

const productService = {
  // Get all products with pagination
  getAll: async (page = 0, size = 10) => {
    const response = await api.get(`/products?page=${page}&size=${size}`);
    return response.data;
  },

  // Get product by ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Search products
  search: async (keyword) => {
    const response = await api.get(`/products/search?keyword=${keyword}`);
    return response.data;
  },

  // Filter by category
  getByCategory: async (category, page = 0, size = 10) => {
    const response = await api.get(
      `/products/category/${category}?page=${page}&size=${size}`
    );
    return response.data;
  },

  // Create product
  create: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Update product
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;