// This is essentially the same as DriverDashboard
// Copy the entire content from src/pages/driver/Dashboard.jsx

import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Schedule,
  Map,
  Navigation,
  Phone,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Card
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `2px solid ${color}30`,
      borderRadius: 3,
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
    </CardContent>
  </Card>
);

const MyDeliveries = () => {
  const deliveries = [
    {
      id: 1,
      orderNumber: 'ORD-2025-101',
      customer: 'John Doe',
      address: '123 Main St, District 1, HCMC',
      phone: '0123456789',
      status: 'in_transit',
      priority: 'high',
      distance: '2.5 km',
    },
    {
      id: 2,
      orderNumber: 'ORD-2025-102',
      customer: 'Jane Smith',
      address: '456 Nguyen Hue, District 1, HCMC',
      phone: '0987654321',
      status: 'pending',
      priority: 'normal',
      distance: '3.8 km',
    },
    {
      id: 3,
      orderNumber: 'ORD-2025-103',
      customer: 'Mike Johnson',
      address: '789 Le Loi, District 3, HCMC',
      phone: '0456789123',
      status: 'pending',
      priority: 'low',
      distance: '5.2 km',
    },
  ];

  const getStatusChip = (status) => {
    switch (status) {
      case 'in_transit':
        return <Chip label="In Transit" color="info" size="small" icon={<LocalShipping />} />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" icon={<Schedule />} />;
      case 'completed':
        return <Chip label="Completed" color="success" size="small" icon={<CheckCircle />} />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'normal':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          My Deliveries
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your delivery tasks and routes
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Today's Deliveries"
            value="12"
            icon={<LocalShipping sx={{ fontSize: 28, color: '#F97316' }} />}
            color="#F97316"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Completed"
            value="8"
            icon={<CheckCircle sx={{ fontSize: 28, color: '#10B981' }} />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Pending"
            value="4"
            icon={<Schedule sx={{ fontSize: 28, color: '#F59E0B' }} />}
            color="#F59E0B"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Active Deliveries */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Active Deliveries
            </Typography>
            <List>
              {deliveries.map((delivery, index) => (
                <Box key={delivery.id}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: delivery.status === 'in_transit' ? '#3B82F615' : '#FFF7ED',
                      backgroundColor: delivery.status === 'in_transit' ? '#3B82F605' : 'white',
                      mb: 2,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: getPriorityColor(delivery.priority) + '20',
                          color: getPriorityColor(delivery.priority),
                          width: 48,
                          height: 48,
                        }}
                      >
                        <LocalShipping />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            {delivery.orderNumber}
                          </Typography>
                          {getStatusChip(delivery.status)}
                          <Chip
                            label={delivery.priority.toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: getPriorityColor(delivery.priority) + '20',
                              color: getPriorityColor(delivery.priority),
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Customer: {delivery.customer}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Map fontSize="small" /> {delivery.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Phone fontSize="small" /> {delivery.phone}
                          </Typography>
                          <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Navigation fontSize="small" /> {delivery.distance} away
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Navigation />}
                        sx={{ minWidth: 140 }}
                      >
                        Navigate
                      </Button>
                      {delivery.status === 'in_transit' ? (
                        <Button
                          variant="outlined"
                          size="small"
                          color="success"
                          startIcon={<CheckCircle />}
                        >
                          Complete
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<LocalShipping />}
                        >
                          Start
                        </Button>
                      )}
                    </Box>
                  </ListItem>
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Route Summary */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Today's Route
            </Typography>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#F97316', mb: 1 }}>
                24.5 km
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Total distance today
              </Typography>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Map />}
                size="large"
                sx={{ mb: 2 }}
              >
                View Full Route
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
              >
                Optimize Route
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Performance
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                On-Time Delivery Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>
                98.5%
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Average Delivery Time
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#3B82F6' }}>
                32 min
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Customer Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>
                  4.9
                </Typography>
                <Typography variant="h6">⭐⭐⭐⭐⭐</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyDeliveries;