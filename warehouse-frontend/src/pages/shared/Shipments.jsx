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
  IconButton,
  Tooltip,
} from '@mui/material';
import { Search, LocalShipping, Visibility, Map } from '@mui/icons-material';

const Shipments = () => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const shipments = [
    {
      id: 1,
      trackingNumber: 'SHP-2025-001',
      orderNumber: 'ORD-2025-101',
      driver: 'John Driver',
      origin: 'Warehouse A',
      destination: 'District 1, HCMC',
      status: 'IN_TRANSIT',
      estimatedDelivery: '2025-11-30',
    },
    {
      id: 2,
      trackingNumber: 'SHP-2025-002',
      orderNumber: 'ORD-2025-102',
      driver: 'Jane Delivery',
      origin: 'Warehouse B',
      destination: 'District 3, HCMC',
      status: 'PENDING',
      estimatedDelivery: '2025-12-01',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      IN_TRANSIT: 'info',
      DELIVERED: 'success',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
  };

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.trackingNumber.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      shipment.orderNumber.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Shipments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage all shipments
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by tracking number or order number..."
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

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FFF7ED' }}>
              <TableCell sx={{ fontWeight: 700 }}>Tracking #</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Driver</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Route</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Est. Delivery</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredShipments.map((shipment) => (
              <TableRow key={shipment.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalShipping sx={{ color: '#F97316' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {shipment.trackingNumber}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{shipment.orderNumber}</TableCell>
                <TableCell>{shipment.driver}</TableCell>
                <TableCell>
                  <Typography variant="body2">{shipment.origin}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    → {shipment.destination}
                  </Typography>
                </TableCell>
                <TableCell>{shipment.estimatedDelivery}</TableCell>
                <TableCell>
                  <Chip
                    label={shipment.status.replace('_', ' ')}
                    color={getStatusColor(shipment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton size="small" color="primary">
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Track on Map">
                    <IconButton size="small">
                      <Map fontSize="small" />
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

export default Shipments;