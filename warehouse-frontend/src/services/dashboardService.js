import api from './api';

const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get recent orders
  getRecentOrders: async (limit = 5) => {
    const response = await api.get(`/dashboard/recent-orders?limit=${limit}`);
    return response.data;
  },

  // Get top products
  getTopProducts: async (limit = 10) => {
    const response = await api.get(`/dashboard/top-products?limit=${limit}`);
    return response.data;
  },
};

export default dashboardService;