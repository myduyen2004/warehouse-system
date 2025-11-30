import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Logout,
  Receipt,
  LocalShipping,
  Warehouse,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

const PublicLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/');
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)',
          boxShadow: '0px 4px 20px rgba(249, 115, 22, 0.3)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Warehouse sx={{ mr: 1, fontSize: 32 }} />
            <Typography
              variant="h5"
              sx={{
                flexGrow: 1,
                fontWeight: 800,
                cursor: 'pointer',
                letterSpacing: 1,
              }}
              onClick={() => navigate('/')}
            >
              WareHub
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                color="inherit"
                onClick={() => navigate('/')}
                sx={{ fontWeight: 600 }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/shop')}
                sx={{ fontWeight: 600 }}
              >
                Shop
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/track')}
                startIcon={<LocalShipping />}
                sx={{ fontWeight: 600 }}
              >
                Track Order
              </Button>

              {token ? (
                <>
                  <IconButton
                    color="inherit"
                    onClick={() => navigate('/cart')}
                  >
                    <Badge badgeContent={0} color="error">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>

                  <IconButton color="inherit" onClick={handleMenuOpen}>
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        bgcolor: 'white', 
                        color: 'primary.main',
                        fontWeight: 700,
                      }}
                    >
                      {user?.fullName?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: { mt: 1, minWidth: 220 },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user?.fullName || user?.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                      <Chip
                        label={user?.role}
                        size="small"
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                      <Person sx={{ mr: 1 }} /> My Profile
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/my-orders'); handleMenuClose(); }}>
                      <Receipt sx={{ mr: 1 }} /> My Orders
                    </MenuItem>
                    {(user?.role === 'DRIVER') && (
                      <MenuItem onClick={() => { navigate('/driver/dashboard'); handleMenuClose(); }}>
                        <LocalShipping sx={{ mr: 1 }} /> My Deliveries
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <Logout sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate('/login')}
                    sx={{ fontWeight: 600 }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 700,
                      '&:hover': { bgcolor: 'grey.100' },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#FFF7ED' }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          color: 'white',
          py: 6,
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warehouse sx={{ mr: 1, fontSize: 32, color: '#F97316' }} />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  WareHub
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: 300 }}>
                Your trusted warehouse and logistics partner. Fast, reliable, and secure delivery services.
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Links
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', mb: 0.5, '&:hover': { color: '#F97316' } }} onClick={() => navigate('/shop')}>
                Shop
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', mb: 0.5, '&:hover': { color: '#F97316' } }} onClick={() => navigate('/track')}>
                Track Order
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#F97316' } }} onClick={() => navigate('/my-orders')}>
                My Orders
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>📧 support@warehub.com</Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>📞 1900-1234</Typography>
              <Typography variant="body2">📍 123 Warehouse St, City</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.7 }}>
            © 2025 WareHub. All rights reserved. | Built with ❤️ for logistics
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout;