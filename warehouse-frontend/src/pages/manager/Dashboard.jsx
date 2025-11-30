import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Warehouse,
  Inventory,
  ShoppingCart,
  LocalShipping,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

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
            {change}% from last week
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const ManagerDashboard = () => {
  const weeklyData = [
    { day: 'Mon', orders: 45, shipments: 38 },
    { day: 'Tue', orders: 52, shipments: 45 },
    { day: 'Wed', orders: 48, shipments: 42 },
    { day: 'Thu', orders: 61, shipments: 55 },
    { day: 'Fri', orders: 55, shipments: 50 },
    { day: 'Sat', orders: 67, shipments: 60 },
    { day: 'Sun', orders: 43, shipments: 40 },
  ];

  const inventoryData = [
    { category: 'Electronics', stock: 450 },
    { category: 'Clothing', stock: 320 },
    { category: 'Food', stock: 180 },
    { category: 'Furniture', stock: 240 },
    { category: 'Books', stock: 560 },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Manager Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor warehouse operations and performance metrics
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Warehouses"
            value="12"
            icon={<Warehouse sx={{ fontSize: 28, color: '#F97316' }} />}
            color="#F97316"
            change={0}
            changeType="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value="1,750"
            icon={<Inventory sx={{ fontSize: 28, color: '#F59E0B' }} />}
            color="#F59E0B"
            change={5.2}
            changeType="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Weekly Orders"
            value="371"
            icon={<ShoppingCart sx={{ fontSize: 28, color: '#10B981' }} />}
            color="#10B981"
            change={12.5}
            changeType="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Shipments"
            value="89"
            icon={<LocalShipping sx={{ fontSize: 28, color: '#3B82F6' }} />}
            color="#3B82F6"
            change={-2.3}
            changeType="down"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Weekly Performance */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Weekly Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#F97316"
                  strokeWidth={3}
                  name="Orders"
                />
                <Line
                  type="monotone"
                  dataKey="shipments"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Shipments"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Inventory by Category */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Inventory by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#F97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;