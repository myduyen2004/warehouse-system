import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper } from '@mui/material';
import { Lock } from '@mui/icons-material';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Public Pages
import Home from '../pages/public/Home';
import Shop from '../pages/public/Shop';
import TrackOrder from '../pages/public/TrackOrder';
import MyOrders from '../pages/public/MyOrders';
import Cart from '../pages/public/Cart';
import Profile from '../pages/public/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import AdminReports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';

// Manager Pages
import ManagerDashboard from '../pages/manager/Dashboard';

// Warehouse Pages
import WarehouseDashboard from '../pages/warehouse/Dashboard';
import Inventory from '../pages/warehouse/Inventory';
import ReceiveGoods from '../pages/warehouse/ReceiveGoods';
import DispatchGoods from '../pages/warehouse/DispatchGoods';

// Driver Pages
import DriverDashboard from '../pages/driver/Dashboard';
import DriverRoutes from '../pages/driver/Routes';
import MyDeliveries from '../pages/driver/MyDeliveries';

// Shared Pages
import Warehouses from '../pages/shared/Warehouses';
import Products from '../pages/shared/Products';
import Orders from '../pages/shared/Orders';
import Shipments from '../pages/shared/Shipments';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          p: 3,
        }}
      >
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            maxWidth: 500,
            borderRadius: 3,
            border: '2px solid #FED7AA',
          }}
        >
          <Lock sx={{ fontSize: 80, color: '#F97316', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            You don't have permission to access this page.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Required role: <strong>{allowedRoles.join(' or ')}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your role: <strong>{user?.role}</strong>
          </Typography>
        </Paper>
      </Box>
    );
  }

  return children;
};

const AppRoutes = () => {
  const { token, user } = useSelector((state) => state.auth);

  // Redirect based on role after login
  const getDefaultRoute = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'MANAGER':
        return '/manager/dashboard';
      case 'WAREHOUSE_STAFF':
        return '/warehouse/dashboard';
      case 'DRIVER':
        return '/driver/dashboard';
      case 'CUSTOMER':
        return '/';
      default:
        return '/';
    }
  };

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={token ? <Navigate to={getDefaultRoute()} /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to={getDefaultRoute()} /> : <Register />}
      />

      {/* Public Routes (CUSTOMER, DRIVER, Guest) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/track" element={<TrackOrder />} />
        
        {/* Protected Public Routes (require login) */}
        <Route
          path="/my-orders"
          element={
            <PrivateRoute allowedRoles={['CUSTOMER', 'DRIVER']}>
              <MyOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute allowedRoles={['CUSTOMER']}>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="shipments" element={<Shipments />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path='settings' element={<Settings/>}/>
      </Route>

      {/* Manager Dashboard Routes */}
      <Route
        path="/manager"
        element={
          <PrivateRoute allowedRoles={['MANAGER']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/manager/dashboard" />} />
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="shipments" element={<Shipments />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Warehouse Staff Dashboard Routes */}
      <Route
        path="/warehouse"
        element={
          <PrivateRoute allowedRoles={['WAREHOUSE_STAFF']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/warehouse/dashboard" />} />
        <Route path="dashboard" element={<WarehouseDashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="receive" element={<ReceiveGoods />} />
        <Route path="dispatch" element={<DispatchGoods />} />
        <Route path="report" element={<AdminReports />} />
      </Route>

      {/* Driver Dashboard Routes */}
      <Route
        path="/driver"
        element={
          <PrivateRoute allowedRoles={['DRIVER']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/driver/dashboard" />} />
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="routes" element={<DriverRoutes />} />
        <Route path="history" element={<MyOrders />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} />} />
    </Routes>
  );
};

export default AppRoutes;