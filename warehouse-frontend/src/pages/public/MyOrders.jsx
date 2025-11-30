import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from '@mui/material';
import {
  Search,
  Visibility,
  LocalShipping,
  Cancel,
  Receipt,
  Download,
} from '@mui/icons-material';
import { format } from 'date-fns';
import orderService from '../../services/orderService';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getAll(0, 50);
      setOrders(response.content || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      PROCESSING: 'info',
      COMPLETED: 'success',
      CANCELLED: 'error',
      SHIPPED: 'primary',
    };
    return colors[status] || 'default';
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleCancelOrder = (orderId) => {
    // TODO: Cancel order API
    toast.success('Order cancelled successfully');
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your order history
        </Typography>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by order number or status..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Orders Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FFF7ED' }}>
              <TableCell sx={{ fontWeight: 700 }}>Order Number</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Total Amount
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Receipt sx={{ color: '#F97316' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {order.orderNumber}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {order.orderDate
                    ? format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm')
                    : 'N/A'}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#F97316' }}>
                    {order.totalAmount?.toLocaleString('vi-VN')} ₫
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Track Shipment">
                    <IconButton size="small">
                      <LocalShipping fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {order.status === 'PENDING' && (
                    <Tooltip title="Cancel Order">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        <Cancel fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Download Invoice">
                    <IconButton size="small">
                      <Download fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredOrders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Receipt sx={{ fontSize: 80, color: '#D1D5DB', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No orders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start shopping to see your orders here
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }}>
            Browse Products
          </Button>
        </Box>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          Order Details
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2, backgroundColor: '#FFF7ED' }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Order Number
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {selectedOrder.orderNumber}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Order Date
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {selectedOrder.orderDate
                        ? format(new Date(selectedOrder.orderDate), 'dd/MM/yyyy')
                        : 'N/A'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Status
                    </Typography>
                    <Chip
                      label={selectedOrder.status}
                      color={getStatusColor(selectedOrder.status)}
                      sx={{ fontWeight: 600 }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Amount
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#F97316' }}>
                      {selectedOrder.totalAmount?.toLocaleString('vi-VN')} ₫
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Order Items
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Order items details will be displayed here
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<LocalShipping />}>
            Track Shipment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyOrders;