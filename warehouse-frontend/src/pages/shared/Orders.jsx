import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Visibility,
  MoreVert,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  fetchOrders,
  updateOrderStatus,
} from '../../store/slices/orderSlice';
import CreateOrderDialog from './CreateOrderDialog';
import OrderDetailsDialog from './OrderDetailsDialog';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, totalElements, currentPage, isLoading } = useSelector(
    (state) => state.order
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOrderId, setMenuOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [page, rowsPerPage]);

  const loadOrders = () => {
    dispatch(fetchOrders({ page, size: rowsPerPage }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenMenu = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setMenuOrderId(orderId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOrderId(null);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ id: menuOrderId, status: newStatus })
      ).unwrap();
      toast.success('Order status updated successfully');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
    handleCloseMenu();
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      PROCESSING: 'info',
      COMPLETED: 'success',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
  };

  if (isLoading && orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Orders</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Order
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {order.orderNumber}
                  </Typography>
                </TableCell>
                <TableCell>{order.customerName || 'N/A'}</TableCell>
                <TableCell>
                  {format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell align="right">
                  {order.totalAmount?.toLocaleString('vi-VN')} VND
                </TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleViewDetails(order)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleOpenMenu(e, order.id)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Status Change Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleStatusChange('PROCESSING')}>
          Mark as Processing
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('COMPLETED')}>
          Mark as Completed
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('CANCELLED')}>
          Cancel Order
        </MenuItem>
      </Menu>

      <CreateOrderDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={loadOrders}
      />

      <OrderDetailsDialog
        open={detailsDialogOpen}
        order={selectedOrder}
        onClose={() => setDetailsDialogOpen(false)}
      />
    </Box>
  );
};

export default Orders;