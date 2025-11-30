import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';

const OrderDetailsDialog = ({ open, order, onClose }) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      PROCESSING: 'info',
      COMPLETED: 'success',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Order Details - {order.orderNumber}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Order Information */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Order Date
            </Typography>
            <Typography variant="body1">
              {format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={order.status}
              color={getStatusColor(order.status)}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Customer Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1">{order.customerName}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body1">{order.customerPhone}</Typography>
          </Grid>

          {order.customerEmail && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{order.customerEmail}</Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Shipping Address
            </Typography>
            <Typography variant="body1">{order.shippingAddress}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.productName || 'N/A'}</TableCell>
                      <TableCell align="right">
                        {item.price?.toLocaleString('vi-VN')} VND
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}{' '}
                        VND
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="h6">Total:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" color="primary">
                        {order.totalAmount?.toLocaleString('vi-VN')} VND
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Payment & Notes */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Payment Method
            </Typography>
            <Typography variant="body1">{order.paymentMethod}</Typography>
          </Grid>

          {order.notes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Notes
              </Typography>
              <Typography variant="body1">{order.notes}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;