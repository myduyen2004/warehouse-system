import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { Download, Assessment } from '@mui/icons-material';

const Reports = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate and download various reports
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {[
          { title: 'Sales Report', description: 'Monthly sales analysis' },
          { title: 'Inventory Report', description: 'Stock levels and movements' },
          { title: 'Delivery Performance', description: 'Driver and shipment metrics' },
          { title: 'Customer Analytics', description: 'Customer behavior insights' },
        ].map((report, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Assessment sx={{ fontSize: 60, color: '#F97316', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {report.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {report.description}
              </Typography>
              <Button variant="contained" startIcon={<Download />} fullWidth>
                Download
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Reports;