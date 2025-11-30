import { useEffect, useState } from 'react';
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
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  createWarehouse,
  updateWarehouse,
} from '../../store/slices/warehouseSlice';

const initialState = {
  name: '',
  address: '',
  city: '',
  district: '',
  latitude: '',
  longitude: '',
  capacity: '',
  phoneNumber: '',
  managerName: '',
  status: 'ACTIVE',
};

const WarehouseDialog = ({ open, warehouse, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (warehouse) {
      setFormData(warehouse);
    } else {
      setFormData(initialState);
    }
  }, [warehouse]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (warehouse) {
        await dispatch(updateWarehouse({ id: warehouse.id, data: formData })).unwrap();
        toast.success('Warehouse updated successfully');
      } else {
        await dispatch(createWarehouse(formData)).unwrap();
        toast.success('Warehouse created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {warehouse ? 'Edit Warehouse' : 'Create Warehouse'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Warehouse Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                type="number"
                value={formData.latitude}
                onChange={handleChange}
                inputProps={{ step: 'any' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                type="number"
                value={formData.longitude}
                onChange={handleChange}
                inputProps={{ step: 'any' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Capacity (m³)"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Manager Name"
                name="managerName"
                value={formData.managerName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {warehouse ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WarehouseDialog;