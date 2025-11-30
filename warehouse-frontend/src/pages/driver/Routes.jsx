import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
  Divider,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Map,
  Navigation,
  LocationOn,
  Timer,
  DirectionsCar,
  Speed,
  LocalShipping,
  Phone,
  Info,
  Refresh,
} from '@mui/icons-material';

const Routes = () => {
  const [optimizedRoute, setOptimizedRoute] = useState(false);

  const currentRoute = {
    totalDistance: '24.5 km',
    estimatedTime: '2 hours 15 min',
    stops: 8,
    currentStop: 3,
  };

  const deliveryStops = [
    {
      id: 1,
      orderNumber: 'ORD-2025-101',
      customer: 'John Doe',
      address: '123 Main St, District 1',
      phone: '0123456789',
      distance: '2.5 km',
      eta: '10:30 AM',
      priority: 'high',
      status: 'completed',
    },
    {
      id: 2,
      orderNumber: 'ORD-2025-102',
      customer: 'Jane Smith',
      address: '456 Nguyen Hue, District 1',
      phone: '0987654321',
      distance: '1.8 km',
      eta: '11:00 AM',
      priority: 'high',
      status: 'completed',
    },
    {
      id: 3,
      orderNumber: 'ORD-2025-103',
      customer: 'Mike Johnson',
      address: '789 Le Loi, District 3',
      phone: '0456789123',
      distance: '3.2 km',
      eta: '11:45 AM',
      priority: 'normal',
      status: 'current',
    },
    {
      id: 4,
      orderNumber: 'ORD-2025-104',
      customer: 'Sarah Wilson',
      address: '321 Pasteur, District 3',
      phone: '0321654987',
      distance: '2.1 km',
      eta: '12:30 PM',
      priority: 'normal',
      status: 'pending',
    },
    {
      id: 5,
      orderNumber: 'ORD-2025-105',
      customer: 'Tom Brown',
      address: '654 Tran Hung Dao, District 5',
      phone: '0789456123',
      distance: '5.5 km',
      eta: '1:15 PM',
      priority: 'low',
      status: 'pending',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'current':
        return '#3B82F6';
      case 'pending':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'normal':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleOptimizeRoute = () => {
    setOptimizedRoute(!optimizedRoute);
    // TODO: Call optimization algorithm
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Route Map
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Navigate your delivery route efficiently
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Map Area */}
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 0,
              borderRadius: 3,
              overflow: 'hidden',
              mb: 3,
              height: 500,
              position: 'relative',
            }}
          >
            {/* Map Placeholder */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Map sx={{ fontSize: 120, color: 'white', opacity: 0.5 }} />
              <Box
                sx={{
                  position: 'absolute',
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Interactive Map
                </Typography>
                <Typography variant="body1">
                  Google Maps / OpenStreetMap Integration
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2, bgcolor: 'white', color: '#667eea', '&:hover': { bgcolor: '#f0f0f0' } }}
                  startIcon={<Navigation />}
                >
                  Start Navigation
                </Button>
              </Box>
            </Box>

            {/* Map Controls */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                sx={{ bgcolor: 'white', color: 'primary.main', minWidth: 'auto', p: 1.5 }}
              >
                <Navigation />
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: 'white', color: 'primary.main', minWidth: 'auto', p: 1.5 }}
              >
                <Refresh />
              </Button>
            </Box>
          </Paper>

          {/* Route Stats */}
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card sx={{ borderRadius: 3, border: '2px solid #FED7AA' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <DirectionsCar sx={{ fontSize: 40, color: '#F97316', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#F97316' }}>
                    {currentRoute.totalDistance}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Distance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ borderRadius: 3, border: '2px solid #FED7AA' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Timer sx={{ fontSize: 40, color: '#F59E0B', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#F59E0B' }}>
                    {currentRoute.estimatedTime}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Est. Time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ borderRadius: 3, border: '2px solid #FED7AA' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <LocationOn sx={{ fontSize: 40, color: '#10B981', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#10B981' }}>
                    {currentRoute.stops}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Stops
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ borderRadius: 3, border: '2px solid #FED7AA' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Speed sx={{ fontSize: 40, color: '#3B82F6', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#3B82F6' }}>
                    {currentRoute.currentStop}/{currentRoute.stops}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Route List */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Route Optimization
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={optimizedRoute}
                    onChange={handleOptimizeRoute}
                    color="primary"
                  />
                }
                label=""
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {optimizedRoute
                ? 'Route optimized for shortest distance'
                : 'Route follows order sequence'}
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Refresh />}
              onClick={handleOptimizeRoute}
            >
              Re-optimize Route
            </Button>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Delivery Stops
            </Typography>
            <List sx={{ maxHeight: 600, overflow: 'auto' }}>
              {deliveryStops.map((stop, index) => (
                <Box key={stop.id}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor:
                        stop.status === 'current' ? '#3B82F615' : 'transparent',
                      border: stop.status === 'current' ? '2px solid #3B82F6' : 'none',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: getStatusColor(stop.status) + '20',
                          color: getStatusColor(stop.status),
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {stop.customer}
                          </Typography>
                          <Chip
                            label={stop.priority.toUpperCase()}
                            color={getPriorityColor(stop.priority)}
                            size="small"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {stop.orderNumber}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
                          >
                            <LocationOn sx={{ fontSize: 14 }} />
                            {stop.address}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="caption" color="primary">
                              <Navigation sx={{ fontSize: 12, mr: 0.5 }} />
                              {stop.distance}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              <Timer sx={{ fontSize: 12, mr: 0.5 }} />
                              ETA: {stop.eta}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <IconButton size="small" color="primary">
                        <Phone fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <Info fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < deliveryStops.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Routes;