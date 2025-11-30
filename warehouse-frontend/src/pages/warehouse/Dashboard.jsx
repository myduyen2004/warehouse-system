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
  Divider,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  Inventory,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  MoveToInbox,
  Archive,
  Assignment,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `2px solid ${color}30`,
      borderRadius: 3,
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
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
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const WarehouseDashboard = () => {
  const todayTasks = [
    { id: 1, type: 'receive', item: 'Electronics Shipment #A123', quantity: 150, status: 'pending' },
    { id: 2, type: 'dispatch', item: 'Order #ORD-2025-001', quantity: 45, status: 'in_progress' },
    { id: 3, type: 'receive', item: 'Clothing Batch #C456', quantity: 320, status: 'pending' },
    { id: 4, type: 'dispatch', item: 'Order #ORD-2025-002', quantity: 78, status: 'pending' },
    { id: 5, type: 'stock_check', item: 'Zone A Inventory Check', quantity: null, status: 'pending' },
  ];

  const stockLevels = [
    { zone: 'Zone A', utilization: 87, status: 'warning' },
    { zone: 'Zone B', utilization: 92, status: 'critical' },
    { zone: 'Zone C', utilization: 65, status: 'good' },
    { zone: 'Zone D', utilization: 73, status: 'good' },
  ];

  const activityData = [
    { hour: '08:00', received: 12, dispatched: 8 },
    { hour: '10:00', received: 18, dispatched: 15 },
    { hour: '12:00', received: 15, dispatched: 20 },
    { hour: '14:00', received: 22, dispatched: 18 },
    { hour: '16:00', received: 10, dispatched: 25 },
  ];

  const getTaskIcon = (type) => {
    switch (type) {
      case 'receive':
        return <MoveToInbox sx={{ color: '#10B981' }} />;
      case 'dispatch':
        return <Archive sx={{ color: '#F97316' }} />;
      case 'stock_check':
        return <Assignment sx={{ color: '#3B82F6' }} />;
      default:
        return <Inventory />;
    }
  };

  const getTaskColor = (type) => {
    switch (type) {
      case 'receive':
        return 'success';
      case 'dispatch':
        return 'primary';
      case 'stock_check':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'in_progress':
        return <Chip label="In Progress" color="info" size="small" />;
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Warehouse Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage daily warehouse operations and inventory
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Receipts"
            value="77"
            icon={<MoveToInbox sx={{ fontSize: 28, color: '#10B981' }} />}
            color="#10B981"
            subtitle="Items received today"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Dispatches"
            value="86"
            icon={<Archive sx={{ fontSize: 28, color: '#F97316' }} />}
            color="#F97316"
            subtitle="Items dispatched today"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Tasks"
            value="12"
            icon={<Assignment sx={{ fontSize: 28, color: '#F59E0B' }} />}
            color="#F59E0B"
            subtitle="Tasks awaiting action"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value="8"
            icon={<Warning sx={{ fontSize: 28, color: '#EF4444' }} />}
            color="#EF4444"
            subtitle="Items need reorder"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Today's Tasks */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Today's Tasks
            </Typography>
            <List>
              {todayTasks.map((task, index) => (
                <Box key={task.id}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      '&:hover': { backgroundColor: '#FFF7ED' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getTaskColor(task.type)}.light` }}>
                        {getTaskIcon(task.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {task.item}
                          </Typography>
                          {getStatusChip(task.status)}
                        </Box>
                      }
                      secondary={
                        task.quantity ? `Quantity: ${task.quantity} units` : 'Inventory check required'
                      }
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ ml: 2 }}
                      disabled={task.status === 'in_progress'}
                    >
                      {task.status === 'in_progress' ? 'Processing' : 'Start'}
                    </Button>
                  </ListItem>
                  {index < todayTasks.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Storage Utilization */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Storage Utilization
            </Typography>
            {stockLevels.map((zone) => (
              <Box key={zone.zone} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {zone.zone}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {zone.utilization}%
                    </Typography>
                    {zone.status === 'critical' ? (
                      <Warning sx={{ color: '#EF4444', fontSize: 18 }} />
                    ) : zone.status === 'warning' ? (
                      <Warning sx={{ color: '#F59E0B', fontSize: 18 }} />
                    ) : (
                      <CheckCircle sx={{ color: '#10B981', fontSize: 18 }} />
                    )}
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={zone.utilization}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#FED7AA',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        zone.status === 'critical'
                          ? '#EF4444'
                          : zone.status === 'warning'
                          ? '#F59E0B'
                          : '#10B981',
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Activity Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Today's Activity
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="received" fill="#10B981" name="Received" radius={[8, 8, 0, 0]} />
                <Bar dataKey="dispatched" fill="#F97316" name="Dispatched" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WarehouseDashboard;