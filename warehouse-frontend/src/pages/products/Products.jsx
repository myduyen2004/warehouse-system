import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  fetchProducts,
  searchProducts,
  deleteProduct,
} from '../../store/slices/productSlice';
import ProductDialog from './ProductDialog';

const Products = () => {
  const dispatch = useDispatch();
  const { products, totalElements, currentPage, isLoading } = useSelector(
    (state) => state.product
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    loadProducts();
  }, [page, rowsPerPage]);

  const loadProducts = () => {
    if (searchKeyword) {
      dispatch(searchProducts(searchKeyword));
    } else {
      dispatch(fetchProducts({ page, size: rowsPerPage }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      dispatch(searchProducts(searchKeyword));
      setPage(0);
    } else {
      loadProducts();
    }
  };

  const handleOpenDialog = (product = null) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setDialogOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Product deleted successfully');
        loadProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'success',
      INACTIVE: 'default',
      OUT_OF_STOCK: 'error',
    };
    return colors[status] || 'default';
  };

  if (isLoading && products.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 200 }}>
            <TextField
              fullWidth
              placeholder="Search by name or SKU..."
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
          </form>

          <TextField
            select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterList />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            <MenuItem value="ELECTRONICS">Electronics</MenuItem>
            <MenuItem value="CLOTHING">Clothing</MenuItem>
            <MenuItem value="FOOD">Food</MenuItem>
            <MenuItem value="FURNITURE">Furniture</MenuItem>
            <MenuItem value="TOYS">Toys</MenuItem>
            <MenuItem value="BOOKS">Books</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </TextField>

          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ minWidth: 120 }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock Quantity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>{product.sku}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {product.name}
                  </Typography>
                  {product.description && (
                    <Typography variant="caption" color="text.secondary">
                      {product.description.substring(0, 50)}...
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell align="right">
                  {product.price?.toLocaleString('vi-VN')} VND
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    color={product.stockQuantity < 10 ? 'error' : 'inherit'}
                  >
                    {product.stockQuantity}
                  </Typography>
                </TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>
                  <Chip
                    label={product.status}
                    color={getStatusColor(product.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      <ProductDialog
        open={dialogOpen}
        product={selectedProduct}
        onClose={handleCloseDialog}
        onSuccess={loadProducts}
      />
    </Box>
  );
};

export default Products;