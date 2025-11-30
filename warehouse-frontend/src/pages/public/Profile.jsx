import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // TODO: Save to backend
    setEditing(false);
  };

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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: '#F97316',
              fontSize: '2.5rem',
              fontWeight: 700,
              mr: 3,
            }}
          >
            {user?.fullName?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              {user?.fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              @{user?.username}
            </Typography>
            <Chip
              label={user?.role?.replace('_', ' ')}
              color={getRoleColor(user?.role)}
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Personal Information
          </Typography>
          {!editing ? (
            <Button startIcon={<Edit />} onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button startIcon={<Save />} variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button startIcon={<Cancel />} onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Username" value={user?.username} disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!editing}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;