import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  Save,
  Notifications,
  Security,
  Language,
  Palette,
  Email,
  Sms,
  LocationOn,
  Business,
  AttachMoney,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'WareHub Logistics',
    email: 'contact@warehub.com',
    phone: '1900-1234',
    address: '123 Warehouse St, District 1, HCMC',
    taxId: '0123456789',
    currency: 'VND',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderAlerts: true,
    lowStockAlerts: true,
    shipmentUpdates: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
  });

  const handleGeneralChange = (e) => {
    setGeneralSettings({ ...generalSettings, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (name) => (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: e.target.checked,
    });
  };

  const handleSecurityChange = (name) => (e) => {
    setSecuritySettings({
      ...securitySettings,
      [name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const handleSaveGeneral = () => {
    toast.success('General settings saved successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification settings saved successfully');
  };

  const handleSaveSecurity = () => {
    toast.success('Security settings saved successfully');
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          System Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure system preferences and parameters
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Business sx={{ fontSize: 32, color: '#F97316' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                General Settings
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={generalSettings.companyName}
                  onChange={handleGeneralChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={generalSettings.email}
                  onChange={handleGeneralChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={generalSettings.phone}
                  onChange={handleGeneralChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={2}
                  value={generalSettings.address}
                  onChange={handleGeneralChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tax ID"
                  name="taxId"
                  value={generalSettings.taxId}
                  onChange={handleGeneralChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Currency"
                  name="currency"
                  value={generalSettings.currency}
                  onChange={handleGeneralChange}
                  SelectProps={{ native: true }}
                >
                  <option value="VND">VND (₫)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveGeneral}
              fullWidth
            >
              Save General Settings
            </Button>
          </Paper>

          {/* Security Settings */}
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Security sx={{ fontSize: 32, color: '#EF4444' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Security Settings
              </Typography>
            </Box>

            <List>
              <ListItem>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText
                  primary="Two-Factor Authentication"
                  secondary="Add an extra layer of security"
                />
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onChange={handleSecurityChange('twoFactorAuth')}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText primary="Session Timeout (minutes)" />
                <TextField
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={handleSecurityChange('sessionTimeout')}
                  sx={{ width: 100 }}
                  size="small"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText primary="Password Expiry (days)" />
                <TextField
                  type="number"
                  value={securitySettings.passwordExpiry}
                  onChange={handleSecurityChange('passwordExpiry')}
                  sx={{ width: 100 }}
                  size="small"
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveSecurity}
              fullWidth
              color="error"
            >
              Save Security Settings
            </Button>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Notifications sx={{ fontSize: 32, color: '#3B82F6' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Notification Settings
              </Typography>
            </Box>

            <List>
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications via email"
                />
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange('emailNotifications')}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Sms />
                </ListItemIcon>
                <ListItemText
                  primary="SMS Notifications"
                  secondary="Receive notifications via SMS"
                />
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onChange={handleNotificationChange('smsNotifications')}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText
                  primary="Order Alerts"
                  secondary="Get notified about new orders"
                />
                <Switch
                  checked={notificationSettings.orderAlerts}
                  onChange={handleNotificationChange('orderAlerts')}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText
                  primary="Low Stock Alerts"
                  secondary="Alert when inventory is low"
                />
                <Switch
                  checked={notificationSettings.lowStockAlerts}
                  onChange={handleNotificationChange('lowStockAlerts')}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText
                  primary="Shipment Updates"
                  secondary="Track shipment status changes"
                />
                <Switch
                  checked={notificationSettings.shipmentUpdates}
                  onChange={handleNotificationChange('shipmentUpdates')}
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveNotifications}
              fullWidth
            >
              Save Notification Settings
            </Button>
          </Paper>

          {/* System Info */}
          <Card sx={{ borderRadius: 3, border: '2px solid #FED7AA' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                System Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Version" />
                  <Chip label="v1.0.0" size="small" color="primary" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Last Updated" />
                  <Typography variant="body2" color="text.secondary">
                    2025-11-30
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Database Status" />
                  <Chip label="Connected" size="small" color="success" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Active Users" />
                  <Typography variant="body2" color="text.secondary">
                    124
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;