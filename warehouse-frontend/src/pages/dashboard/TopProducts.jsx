import { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { Inventory } from '@mui/icons-material';
import dashboardService from '../../services/dashboardService';

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const data = await dashboardService.getTopProducts(5);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load top products', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <List>
      {products.map((product, index) => (
        <ListItem key={product.id}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Inventory />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={product.name}
            secondary={
              <>
                <Typography variant="body2" component="span">
                  SKU: {product.sku}
                </Typography>
                <br />
                <Typography variant="body2" component="span" color="primary">
                  {product.price?.toLocaleString('vi-VN')} VND
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TopProducts;