import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Chip,
  IconButton,
  Pagination,
  Slider,
  Paper,
  Drawer,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  FilterList,
  Close,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { toast } from 'react-toastify';

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll(page - 1, 12);
      setProducts(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCategory =
      categoryFilter === 'ALL' || product.category === categoryFilter;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`);
  };

  const categories = [
    { value: 'ALL', label: 'All Categories', count: products.length },
    { value: 'ELECTRONICS', label: 'Electronics', count: 120 },
    { value: 'CLOTHING', label: 'Clothing', count: 85 },
    { value: 'FOOD', label: 'Food', count: 45 },
    { value: 'FURNITURE', label: 'Furniture', count: 60 },
    { value: 'BOOKS', label: 'Books', count: 200 },
    { value: 'TOYS', label: 'Toys', count: 95 },
  ];

  const FilterSection = () => (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Filters
      </Typography>

      {/* Category Filter */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Category
        </Typography>
        {categories.map((cat) => (
          <Box
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            sx={{
              p: 1,
              mb: 0.5,
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: categoryFilter === cat.value ? 'primary.light' : 'transparent',
              color: categoryFilter === cat.value ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                backgroundColor: categoryFilter === cat.value ? 'primary.main' : 'grey.100',
              },
            }}
          >
            <Typography variant="body2">{cat.label}</Typography>
            <Chip label={cat.count} size="small" />
          </Box>
        ))}
      </Paper>

      {/* Price Filter */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={(e, newValue) => setPriceRange(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={10000000}
          step={100000}
          sx={{
            '& .MuiSlider-thumb': {
              backgroundColor: '#F97316',
            },
            '& .MuiSlider-track': {
              backgroundColor: '#F97316',
            },
            '& .MuiSlider-rail': {
              backgroundColor: '#FED7AA',
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption">
            {priceRange[0].toLocaleString('vi-VN')} VND
          </Typography>
          <Typography variant="caption">
            {priceRange[1].toLocaleString('vi-VN')} VND
          </Typography>
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Shop Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse our wide selection of quality products
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search products by name or SKU..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setFilterDrawerOpen(true)}
          sx={{ 
            display: { xs: 'flex', md: 'none' },
            minWidth: 120,
          }}
        >
          Filters
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar Filters - Desktop */}
        <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <FilterSection />
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredProducts.length} products
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} lg={4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 28px rgba(249, 115, 22, 0.25)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={`https://source.unsplash.com/400x300/?${product.category}`}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'white',
                        '&:hover': { backgroundColor: 'grey.100', color: 'error.main' },
                      }}
                    >
                      <FavoriteBorder />
                    </IconButton>
                    {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                      <Chip
                        label="Low Stock"
                        color="warning"
                        size="small"
                        sx={{ position: 'absolute', top: 8, left: 8 }}
                      />
                    )}
                    {product.stockQuantity === 0 && (
                      <Chip
                        label="Out of Stock"
                        color="error"
                        size="small"
                        sx={{ position: 'absolute', top: 8, left: 8 }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        mb: 1,
                        bgcolor: '#F9731615',
                        color: '#F97316',
                        fontWeight: 600,
                      }}
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      SKU: {product.sku}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <Typography key={i} sx={{ color: '#F59E0B', fontSize: '1rem' }}>
                          ⭐
                        </Typography>
                      ))}
                      <Typography variant="caption" color="text.secondary">
                        (4.8)
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#F97316' }}>
                      {product.price?.toLocaleString('vi-VN')} VND
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stockQuantity === 0}
                      sx={{
                        borderRadius: 2,
                        py: 1.2,
                        fontWeight: 700,
                      }}
                    >
                      {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredProducts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search terms
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Filters
            </Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <FilterSection />
        </Box>
      </Drawer>
    </Container>
  );
};

export default Shop;