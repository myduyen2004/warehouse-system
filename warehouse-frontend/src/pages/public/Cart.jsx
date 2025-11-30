import { useState } from 'react';
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
  IconButton,
  Button,
  TextField,
  Divider,
  Grid,
} from '@mui/material';
import { Delete, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Samsung Galaxy S24', price: 25000000, quantity: 1, image: 'phone.jpg' },
    { id: 2, name: 'Laptop Dell XPS 15', price: 45000000, quantity: 1, image: 'laptop.jpg' },
  ]);

  const updateQuantity = (id, delta) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50000;
  const total = subtotal + shipping;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Shopping Cart ({cartItems.length} items)
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#FFF7ED' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">
                    Quantity
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Total
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            backgroundColor: '#FFF7ED',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ShoppingCart sx={{ color: '#F97316' }} />
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {item.price.toLocaleString('vi-VN')} ₫
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, -1)}
                          sx={{ border: '1px solid #E5E7EB' }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          size="small"
                          sx={{ width: 50 }}
                          inputProps={{ style: { textAlign: 'center' } }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, 1)}
                          sx={{ border: '1px solid #E5E7EB' }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#F97316' }}>
                        {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => removeItem(item.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '2px solid #FED7AA' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Order Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">{subtotal.toLocaleString('vi-VN')} ₫</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Shipping:</Typography>
                <Typography variant="body2">{shipping.toLocaleString('vi-VN')} ₫</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F97316' }}>
                {total.toLocaleString('vi-VN')} ₫
              </Typography>
            </Box>
            <Button variant="contained" fullWidth size="large" sx={{ mb: 2, fontWeight: 700 }}>
              Proceed to Checkout
            </Button>
            <Button variant="outlined" fullWidth onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;