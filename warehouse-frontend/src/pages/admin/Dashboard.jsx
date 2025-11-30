import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warehouse,
  Inventory,
  ShoppingCart,
  LocalShipping,
  People,
  AttachMoney,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import dashboardService from '../../services/dashboardService';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon, color, change, changeType }) => (
  <Card
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `2px solid ${color}30`,
      borderRadius: 3,
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}20`, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
      {change && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {changeType === 'up' ? (
            <TrendingUp sx={{ color: '#10B981', fontSize: 20 }} />
          ) : (
            <TrendingDown sx={{ color: '#EF4444', fontSize: 20 }} />
          )}
          <Typography
            variant="body2"
            sx={{
              color: changeType === 'up' ? '#10B981' : '#EF4444',
              fontWeight: 600,
            }}
          >
            {change}% from last month
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, ordersData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentOrders(5),
      ]);
      setStats(statsData);
      setRecentOrders(ordersData);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const salesData = [
    { month: 'Jan', revenue: 45000, orders: 234 },
    { month: 'Feb', revenue: 52000, orders: 267 },
    { month: 'Mar', revenue: 48000, orders: 245 },
    { month: 'Apr', revenue: 61000, orders: 312 },
    { month: 'May', revenue: 55000, orders: 289 },
    { month: 'Jun', revenue: 67000, orders: 345 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#F97316' },
    { name: 'Clothing', value: 25, color: '#F59E0B' },
    { name: 'Food', value: 15, color: '#10B981' },
    { name: 'Furniture', value: 15, color: '#3B82F6' },
    { name: 'Others', value: 10, color: '#8B5CF6' },
  ];

  const warehousePerformance = [
    { name: 'Warehouse A', utilization: 87, capacity: '5000m³' },
    { name: 'Warehouse B', utilization: 92, capacity: '4500m³' },
    { name: 'Warehouse C', utilization: 78, capacity: '6000m³' },
    { name: 'Warehouse D', utilization: 65, capacity: '3500m³' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      PROCESSING: 'info',
      COMPLETED: 'success',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your warehouse today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value="₫67.5M"
            icon={<AttachMoney sx={{ fontSize: 28, color: '#F97316' }} />}
            color="#F97316"
            change={12.5}
            changeType="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={<ShoppingCart sx={{ fontSize: 28, color: '#F59E0B' }} />}
            color="#F59E0B"
            change={8.2}
            changeType="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Warehouses"
            value={stats?.totalWarehouses || 0}
            icon={<Warehouse sx={{ fontSize: 28, color: '#10B981' }} />}
            color="#10B981"
            change={0}
            changeType="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value="1,234"
            icon={<People sx={{ fontSize: 28, color: '#3B82F6' }} />}
            color="#3B82F6"
            change={5.7}
            changeType="up"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Revenue & Orders Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F97316"
                  strokeWidth={3}
                  name="Revenue (₫1000)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Sales by Category
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Warehouse Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Warehouse Utilization
            </Typography>
            {warehousePerformance.map((warehouse) => (
              <Box key={warehouse.name} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {warehouse.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {warehouse.utilization}% ({warehouse.capacity})
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={warehouse.utilization}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#FED7AA',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        warehouse.utilization > 85 ? '#EF4444' : '#F97316',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Recent Orders
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.customerName || 'N/A'}</TableCell>
                      <TableCell>
                        {order.totalAmount?.toLocaleString('vi-VN')} ₫
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;