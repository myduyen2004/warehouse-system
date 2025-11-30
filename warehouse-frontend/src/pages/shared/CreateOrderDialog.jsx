import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { createOrder } from '../../store/slices/orderSlice';
import productService from '../../services/productService';
import warehouseService from '../../services/warehouseService';

const CreateOrderDialog = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    paymentMethod: 'CASH',
    notes: '',
    warehouseId: '',
  });
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) {
      loadProducts();
      loadWarehouses();
    }
  }, [open]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll(0, 100);
      setProducts(data.content || []);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const loadWarehouses = async () => {
    try {
      const data = await warehouseService.getAll();
      setWarehouses(data || []);
    } catch (error) {
      toast.error('Failed to load warehouses');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddItem = () => {
    if (!selectedProduct) {
      toast.warning('Please select a product');
      return;
    }
    if (quantity <= 0) {
      toast.warning('Quantity must be greater than 0');
      return;
    }

    const existingItem = orderItems.find(
      (item) => item.productId === selectedProduct.id
    );

    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.productId === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          price: selectedProduct.price,
          quantity: quantity,
        },
      ]);
    }

    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveItem = (productId) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (orderItems.length === 0) {
      toast.warning('Please add at least one product');
      return;
    }

    if (!formData.warehouseId) {
      toast.warning('Please select a warehouse');
      return;
    }

    const orderData = {
      ...formData,
      items: orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: calculateTotal(),
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      toast.success('Order created successfully');
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        paymentMethod: 'CASH',
        notes: '',
        warehouseId: '',
      });
      setOrderItems([]);
    } catch (error) {
      toast.error(error.message || 'Failed to create order');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Create New Order</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Customer Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Email"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={2}
                label="Shipping Address"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
              />
            </Grid>

            {/* Order Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                label="Warehouse"
                name="warehouseId"
                value={formData.warehouseId}
                onChange={handleChange}
              >
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                <MenuItem value="E_WALLET">E-Wallet</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>

            {/* Add Products */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Products
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                value={selectedProduct}
                onChange={(event, newValue) => setSelectedProduct(newValue)}
                options={products}
                getOptionLabel={(option) =>
                  `${option.name} (${option.sku}) - ${option.price?.toLocaleString('vi-VN')} VND`
                }
                renderInput={(params) => (
                  <TextField {...params} label="Select Product" />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddItem}
                sx={{ height: 56 }}
              >
                Add Product
              </Button>
            </Grid>

            {/* Order Items Table */}
            {orderItems.length > 0 && (
              <Grid item xs={12}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell align="right">
                            {item.price?.toLocaleString('vi-VN')} VND
                          </TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            {(item.price * item.quantity).toLocaleString(
                              'vi-VN'
                            )}{' '}
                            VND
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveItem(item.productId)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <Typography variant="h6">Total:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6" color="primary">
                            {calculateTotal().toLocaleString('vi-VN')} VND
                          </Typography>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={orderItems.length === 0}
          >
            Create Order
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateOrderDialog;