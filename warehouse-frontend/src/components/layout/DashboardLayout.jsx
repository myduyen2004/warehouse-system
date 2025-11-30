import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Warehouse,
  Inventory,
  ShoppingCart,
  LocalShipping,
  People,
  Assessment,
  Settings,
  Logout,
  Notifications,
  Archive,
  MoveToInbox,
} from '@mui/icons-material';
import Receipt from '@mui/icons-material/Receipt';
import Person from '@mui/icons-material/Person';
import { logout } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

const drawerWidth = 260;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/login');
    handleMenuClose();
  };

  // Menu items based on role
  const getMenuItems = () => {
    const role = user?.role;
    
    const allMenus = {
      ADMIN: [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
        { text: 'Users', icon: <People />, path: '/admin/users' },
        { text: 'Warehouses', icon: <Warehouse />, path: '/admin/warehouses' },
        { text: 'Products', icon: <Inventory />, path: '/admin/products' },
        { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
        { text: 'Shipments', icon: <LocalShipping />, path: '/admin/shipments' },
        { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
        { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
      ],
      MANAGER: [
        { text: 'Dashboard', icon: <Dashboard />, path: '/manager/dashboard' },
        { text: 'Warehouses', icon: <Warehouse />, path: '/manager/warehouses' },
        { text: 'Products', icon: <Inventory />, path: '/manager/products' },
        { text: 'Orders', icon: <ShoppingCart />, path: '/manager/orders' },
        { text: 'Shipments', icon: <LocalShipping />, path: '/manager/shipments' },
        { text: 'Reports', icon: <Assessment />, path: '/manager/reports' },
      ],
      WAREHOUSE_STAFF: [
        { text: 'Dashboard', icon: <Dashboard />, path: '/warehouse/dashboard' },
        { text: 'Inventory', icon: <Inventory />, path: '/warehouse/inventory' },
        { text: 'Receive Goods', icon: <MoveToInbox />, path: '/warehouse/receive' },
        { text: 'Dispatch Goods', icon: <Archive />, path: '/warehouse/dispatch' },
        { text: 'Stock Report', icon: <Assessment />, path: '/warehouse/report' },
      ],
      DRIVER: [
        { text: 'My Deliveries', icon: <LocalShipping />, path: '/driver/dashboard' },
        { text: 'Route Map', icon: <Assessment />, path: '/driver/routes' },
        { text: 'Delivery History', icon: <Receipt />, path: '/driver/history' },
      ],
    };

    return allMenus[role] || [];
  };

  const menuItems = getMenuItems();

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: 'error',
      MANAGER: 'warning',
      WAREHOUSE_STAFF: 'info',
      DRIVER: 'success',
      CUSTOMER: 'primary',
    };
    return colors[role] || 'default';
  };

  const drawer = (
    <Box>
      <Box sx={{ 
        p: 2.5, 
        background: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)',
        color: 'white',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Warehouse sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            WareHub
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Warehouse Management System
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (mobileOpen) handleDrawerToggle();
              }}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(249, 115, 22, 0.1)',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(249, 115, 22, 0.15)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(249, 115, 22, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                minWidth: 40,
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  fontSize: '0.95rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFF7ED' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0px 2px 8px rgba(249, 115, 22, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {user?.role?.replace('_', ' ')} Dashboard
          </Typography>

          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.fullName || user?.username}
              </Typography>
              <Chip
                label={user?.role?.replace('_', ' ')}
                color={getRoleColor(user?.role)}
                size="small"
              />
            </Box>
            <IconButton onClick={handleMenuOpen}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main',
                  width: 40,
                  height: 40,
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
                sx: { mt: 1, minWidth: 200 },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.fullName || user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                <Person sx={{ mr: 1 }} fontSize="small" /> Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
                <Settings sx={{ mr: 1 }} fontSize="small" /> Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <Logout sx={{ mr: 1 }} fontSize="small" /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;