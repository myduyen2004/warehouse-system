import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  LocationOn,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  fetchWarehouses,
  deleteWarehouse,
} from '../../store/slices/warehouseSlice';
import WarehouseDialog from './WarehouseDialog';

const Warehouses = () => {
  const dispatch = useDispatch();
  const { warehouses, isLoading } = useSelector((state) => state.warehouse);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  useEffect(() => {
    dispatch(fetchWarehouses());
  }, [dispatch]);

  const handleOpenDialog = (warehouse = null) => {
    setSelectedWarehouse(warehouse);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedWarehouse(null);
    setDialogOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await dispatch(deleteWarehouse(id)).unwrap();
        toast.success('Warehouse deleted successfully');
      } catch (error) {
        toast.error('Failed to delete warehouse');
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Warehouses</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Warehouse
        </Button>
      </Box>

      <Grid container spacing={3}>
        {warehouses.map((warehouse) => (
          <Grid item xs={12} sm={6} md={4} key={warehouse.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {warehouse.name}
                  </Typography>
                  <Chip
                    label={warehouse.status}
                    color={warehouse.status === 'ACTIVE' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  {warehouse.address}, {warehouse.district}, {warehouse.city}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Manager:</strong> {warehouse.managerName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {warehouse.phoneNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Capacity:</strong> {warehouse.capacity?.toLocaleString()} m³
                  </Typography>
                  <Typography variant="body2">
                    <strong>Current Usage:</strong> {warehouse.currentUsage?.toLocaleString()} m³
                  </Typography>
                </Box>
              </CardContent>

              <CardActions>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleOpenDialog(warehouse)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(warehouse.id)}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <WarehouseDialog
        open={dialogOpen}
        warehouse={selectedWarehouse}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default Warehouses;