import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Box,
} from '@mui/material';
import dashboardService from '../../services/dashboardService';
import { format } from 'date-fns';

const getStatusColor = (status) => {
  const colors = {
    PENDING: 'warning',
    PROCESSING: 'info',
    COMPLETED: 'success',
    CANCELLED: 'error',
  };
  return colors[status] || 'default';
};

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const data = await dashboardService.getRecentOrders(5);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load recent orders', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Total Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{order.customerName || 'N/A'}</TableCell>
              <TableCell>
                {format(new Date(order.orderDate), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell align="right">
                {order.totalAmount?.toLocaleString('vi-VN')} VND
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
  );
};

export default RecentOrders;