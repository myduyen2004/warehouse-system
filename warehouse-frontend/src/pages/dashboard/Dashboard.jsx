import { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Warehouse,
  Inventory,
  ShoppingCart,
  LocalShipping,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import dashboardService from '../../services/dashboardService';
import { toast } from 'react-toastify';
import RecentOrders from './RecentOrders';
import SalesChart from './SalesChart';
import TopProducts from './TopProducts';

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography color="textSecondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {trend > 0 ? (
            <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} />
          ) : (
            <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} />
          )}
          <Typography
            variant="body2"
            color={trend > 0 ? 'success.main' : 'error.main'}
          >
            {Math.abs(trend)}% from last month
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Warehouses"
            value={stats?.totalWarehouses || 0}
            icon={<Warehouse sx={{ fontSize: 40, color: 'primary.main' }} />}
            color="primary"
            trend={5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon={<Inventory sx={{ fontSize: 40, color: 'success.main' }} />}
            color="success"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={<ShoppingCart sx={{ fontSize: 40, color: 'warning.main' }} />}
            color="warning"
            trend={-3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Shipments"
            value={stats?.activeShipments || 0}
            icon={<LocalShipping sx={{ fontSize: 40, color: 'info.main' }} />}
            color="info"
            trend={8}
          />
        </Grid>
      </Grid>

      {/* Charts and Tables */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales Overview
            </Typography>
            <SalesChart />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Products
            </Typography>
            <TopProducts />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <RecentOrders />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;