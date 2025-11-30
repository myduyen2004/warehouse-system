import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Warning,
  CheckCircle,
  Edit,
  QrCode,
} from '@mui/icons-material';

const Inventory = () => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const inventoryItems = [
    { id: 1, sku: 'ELEC-001', name: 'Samsung Galaxy S24', zone: 'A-12', quantity: 45, minStock: 20, maxStock: 100, status: 'good' },
    { id: 2, sku: 'ELEC-002', name: 'iPhone 15 Pro', zone: 'A-13', quantity: 8, minStock: 15, maxStock: 80, status: 'low' },
    { id: 3, sku: 'CLOTH-001', name: 'T-Shirt Pack', zone: 'B-05', quantity: 320, minStock: 50, maxStock: 500, status: 'good' },
    { id: 4, sku: 'FOOD-001', name: 'Instant Noodles Box', zone: 'C-08', quantity: 12, minStock: 30, maxStock: 200, status: 'critical' },
    { id: 5, sku: 'FURN-001', name: 'Office Chair', zone: 'D-03', quantity: 28, minStock: 10, maxStock: 50, status: 'good' },
  ];

  const zones = [
    { name: 'Zone A', utilization: 87, capacity: '2000 m³', used: '1740 m³' },
    { name: 'Zone B', utilization: 92, capacity: '1800 m³', used: '1656 m³' },
    { name: 'Zone C', utilization: 65, capacity: '2500 m³', used: '1625 m³' },
    { name: 'Zone D', utilization: 73, capacity: '1500 m³', used: '1095 m³' },
  ];

  const getStatusChip = (status) => {
    switch (status) {
      case 'critical':
        return <Chip label="Critical" color="error" size="small" icon={<Warning />} />;
      case 'low':
        return <Chip label="Low Stock" color="warning" size="small" icon={<Warning />} />;
      case 'good':
        return <Chip label="Good" color="success" size="small" icon={<CheckCircle />} />;
      default:
        return null;
    }
  };

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Inventory Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage warehouse stock levels
        </Typography>
      </Box>

      {/* Zone Utilization */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {zones.map((zone) => (
          <Grid item xs={12} sm={6} md={3} key={zone.name}>
            <Card sx={{ borderRadius: 3, border: '2px solid #FED7AA' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {zone.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {zone.used} / {zone.capacity}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={zone.utilization}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#FED7AA',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: zone.utilization > 85 ? '#EF4444' : '#F97316',
                      borderRadius: 5,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {zone.utilization}% Utilized
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by product name or SKU..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Inventory Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FFF7ED' }}>
              <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Zone/Location</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Current Stock</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Min/Max</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {item.sku}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={item.zone} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: item.status === 'critical' ? '#EF4444' : item.status === 'low' ? '#F59E0B' : 'inherit',
                    }}
                  >
                    {item.quantity}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption" color="text.secondary">
                    {item.minStock} / {item.maxStock}
                  </Typography>
                </TableCell>
                <TableCell>{getStatusChip(item.status)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit Stock">
                    <IconButton size="small" color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Generate QR">
                    <IconButton size="small">
                      <QrCode fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Inventory;