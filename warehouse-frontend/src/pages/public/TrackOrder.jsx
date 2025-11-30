import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import { Search, LocalShipping, CheckCircle, Schedule } from '@mui/icons-material';

const TrackOrder = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderData, setOrderData] = useState(null);

  const handleTrack = () => {
    // Mock data
    setOrderData({
      orderNumber: 'ORD-2025-001',
      status: 'in_transit',
      currentStep: 2,
      estimatedDelivery: '2025-11-30',
      customer: 'John Doe',
      address: '123 Main St, District 1, HCMC',
      timeline: [
        { date: '2025-11-27 10:30', status: 'Order Placed', completed: true },
        { date: '2025-11-27 14:20', status: 'Processing', completed: true },
        { date: '2025-11-28 09:15', status: 'Out for Delivery', completed: true },
        { date: 'Expected: 2025-11-30', status: 'Delivered', completed: false },
      ],
    });
  };

  const steps = ['Order Placed', 'Processing', 'Out for Delivery', 'Delivered'];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <LocalShipping sx={{ fontSize: 60, color: '#F97316', mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
          Track Your Order
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Enter your tracking number to see real-time updates
        </Typography>
      </Box>

      {/* Search Box */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)',
          border: '2px solid #FED7AA',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Enter your order number (e.g., ORD-2025-001)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="contained"
            size="large"
            startIcon={<Search />}
            onClick={handleTrack}
            sx={{
              minWidth: 150,
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Track
          </Button>
        </Box>
      </Paper>

      {/* Tracking Results */}
      {orderData && (
        <Box>
          <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Order #{orderData.orderNumber}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Estimated Delivery: <strong>{orderData.estimatedDelivery}</strong>
                </Typography>
              </Box>
              <Chip
                label="In Transit"
                color="info"
                icon={<LocalShipping />}
                sx={{ fontWeight: 700, fontSize: '1rem', px: 2, py: 3 }}
              />
            </Box>

            <Stepper activeStep={orderData.currentStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      Delivery Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {orderData.customer}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {orderData.address}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      Tracking Timeline
                    </Typography>
                    {orderData.timeline.map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                        {item.completed ? (
                          <CheckCircle sx={{ color: '#10B981' }} />
                        ) : (
                          <Schedule sx={{ color: '#F59E0B' }} />
                        )}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.status}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.date}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default TrackOrder;