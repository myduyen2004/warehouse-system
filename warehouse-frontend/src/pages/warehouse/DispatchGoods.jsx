import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Archive,
  Save,
  Cancel,
  Add,
  Delete,
  QrCode,
  LocalShipping,
  CheckCircle,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const DispatchGoods = () => {
  const [formData, setFormData] = useState({
    orderNumber: '',
    driver: '',
    destination: '',
    estimatedDelivery: '',
    notes: '',
  });

  const [dispatchItems, setDispatchItems] = useState([]);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [scannedSKU, setScannedSKU] = useState('');

  // Mock product data
  const availableProducts = [
    { id: 1, sku: 'ELEC-001', name: 'Samsung Galaxy S24', zone: 'A-12', available: 45 },
    { id: 2, sku: 'ELEC-002', name: 'iPhone 15 Pro', zone: 'A-13', available: 8 },
    { id: 3, sku: 'CLOTH-001', name: 'T-Shirt Pack', zone: 'B-05', available: 320 },
  ];

  const drivers = [
    { id: 1, name: 'John Driver', vehicle: 'Truck A - VN-001' },
    { id: 2, name: 'Jane Delivery', vehicle: 'Van B - VN-002' },
    { id: 3, name: 'Mike Transport', vehicle: 'Truck C - VN-003' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleScanProduct = () => {
    const product = availableProducts.find((p) => p.sku === scannedSKU);
    if (product) {
      const existingItem = dispatchItems.find((item) => item.sku === scannedSKU);
      if (existingItem) {
        setDispatchItems(
          dispatchItems.map((item) =>
            item.sku === scannedSKU
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setDispatchItems([
          ...dispatchItems,
          {
            sku: product.sku,
            name: product.name,
            zone: product.zone,
            quantity: 1,
            available: product.available,
          },
        ]);
      }
      toast.success(`${product.name} added to dispatch list`);
      setScannedSKU('');
    } else {
      toast.error('Product not found');
    }
  };

  const handleQuantityChange = (sku, newQuantity) => {
    const item = dispatchItems.find((i) => i.sku === sku);
    if (newQuantity > item.available) {
      toast.error(`Only ${item.available} units available`);
      return;
    }
    setDispatchItems(
      dispatchItems.map((item) =>
        item.sku === sku ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const handleRemoveItem = (sku) => {
    setDispatchItems(dispatchItems.filter((item) => item.sku !== sku));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dispatchItems.length === 0) {
      toast.error('Please add at least one item to dispatch');
      return;
    }
    if (!formData.orderNumber || !formData.driver || !formData.destination) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Dispatch created successfully!');
    // Reset form
    setFormData({
      orderNumber: '',
      driver: '',
      destination: '',
      estimatedDelivery: '',
      notes: '',
    });
    setDispatchItems([]);
  };

  const getTotalItems = () => {
    return dispatchItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Dispatch Goods
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Prepare outgoing shipments and assign to drivers
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Form */}
        <Grid item xs={12} lg={8}>
          <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Shipment Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Order Number"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  placeholder="ORD-2025-001"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Assign Driver"
                  name="driver"
                  value={formData.driver}
                  onChange={handleChange}
                >
                  {drivers.map((driver) => (
                    <MenuItem key={driver.id} value={driver.name}>
                      {driver.name} ({driver.vehicle})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Destination Address"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="123 Main St, District 1, HCMC"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Estimated Delivery"
                  name="estimatedDelivery"
                  value={formData.estimatedDelivery}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special handling instructions..."
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Items to Dispatch */}
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Items to Dispatch ({getTotalItems()} total)
              </Typography>
              <Button
                variant="contained"
                startIcon={<QrCode />}
                onClick={() => setScanDialogOpen(true)}
              >
                Scan Product
              </Button>
            </Box>

            {dispatchItems.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#FFF7ED' }}>
                      <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Zone</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">
                        Quantity
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">
                        Available
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dispatchItems.map((item) => (
                      <TableRow key={item.sku} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            {item.sku}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Chip label={item.zone} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.sku, parseInt(e.target.value))
                            }
                            size="small"
                            sx={{ width: 80 }}
                            inputProps={{ min: 1, max: item.available }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            color={item.quantity > item.available ? 'error' : 'text.secondary'}
                          >
                            {item.available}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(item.sku)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Archive sx={{ fontSize: 80, color: '#D1D5DB', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No items added yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Scan products or add manually to start
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                size="large"
                onClick={() => {
                  setFormData({
                    orderNumber: '',
                    driver: '',
                    destination: '',
                    estimatedDelivery: '',
                    notes: '',
                  });
                  setDispatchItems([]);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<LocalShipping />}
                size="large"
                onClick={handleSubmit}
                disabled={dispatchItems.length === 0}
              >
                Create Dispatch
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Info Panel */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, border: '2px solid #FED7AA', mb: 3 }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Archive sx={{ fontSize: 80, color: '#F97316', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Dispatch Guidelines
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left', mt: 2 }}>
                  • Verify order number<br />
                  • Scan all items accurately<br />
                  • Check stock availability<br />
                  • Assign experienced driver<br />
                  • Pack items securely<br />
                  • Update system status<br />
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, border: '2px solid #10B98130' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Total Items
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F97316' }}>
                  {getTotalItems()}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Product Types
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>
                  {dispatchItems.length}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Status
                </Typography>
                {dispatchItems.length > 0 ? (
                  <Chip
                    icon={<CheckCircle />}
                    label="Ready to Dispatch"
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                ) : (
                  <Chip label="Pending" color="default" sx={{ fontWeight: 600 }} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Scan Dialog */}
      <Dialog open={scanDialogOpen} onClose={() => setScanDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Scan Product</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Product SKU"
              value={scannedSKU}
              onChange={(e) => setScannedSKU(e.target.value)}
              placeholder="Scan barcode or enter SKU"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleScanProduct();
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Available products:
            </Typography>
            <Box sx={{ mt: 1 }}>
              {availableProducts.map((product) => (
                <Chip
                  key={product.sku}
                  label={`${product.sku} - ${product.name}`}
                  size="small"
                  sx={{ m: 0.5 }}
                  onClick={() => setScannedSKU(product.sku)}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScanDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleScanProduct();
              setScanDialogOpen(false);
            }}
          >
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DispatchGoods;