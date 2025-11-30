import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color = 'primary', trend }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
        {trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend > 0 ? (
              <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} />
            ) : (
              <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              color={trend > 0 ? 'success.main' : 'error.main'}
            >
              {Math.abs(trend)}% from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;