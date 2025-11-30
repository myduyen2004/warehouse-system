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
} from '@mui/material';
import { MoveToInbox, Save, Cancel } from '@mui/icons-material';

const ReceiveGoods = () => {
  const [formData, setFormData] = useState({
    shipmentNumber: '',
    supplier: '',
    productSKU: '',
    quantity: '',
    zone: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit to backend
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Receive Goods
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Log incoming shipments and update inventory
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Shipment Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Shipment Number"
                  name="shipmentNumber"
                  value={formData.shipmentNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Product SKU"
                  name="productSKU"
                  value={formData.productSKU}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Storage Zone"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  placeholder="e.g., A-12"
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
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                size="large"
              >
                Confirm Receipt
              </Button>
              <Button variant="outlined" startIcon={<Cancel />} size="large">
                Cancel
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, border: '2px solid #FED7AA' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <MoveToInbox sx={{ fontSize: 80, color: '#F97316', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Receiving Guidelines
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left', mt: 2 }}>
                  • Verify shipment number matches<br />
                  • Inspect goods for damage<br />
                  • Count quantities accurately<br />
                  • Assign to proper storage zone<br />
                  • Update system immediately<br />
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReceiveGoods;