import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  createProduct,
  updateProduct,
} from '../../store/slices/productSlice';

const initialState = {
  name: '',
  sku: '',
  description: '',
  category: 'OTHER',
  price: '',
  stockQuantity: '',
  unit: 'PCS',
  reorderLevel: '',
  weight: '',
  dimensions: '',
  barcode: '',
  status: 'ACTIVE',
};

const ProductDialog = ({ open, product, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData(initialState);
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        await dispatch(updateProduct({ id: product.id, data: formData })).unwrap();
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(formData)).unwrap();
        toast.success('Product created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {product ? 'Edit Product' : 'Create Product'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                disabled={!!product}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <MenuItem value="ELECTRONICS">Electronics</MenuItem>
                <MenuItem value="CLOTHING">Clothing</MenuItem>
                <MenuItem value="FOOD">Food</MenuItem>
                <MenuItem value="FURNITURE">Furniture</MenuItem>
                <MenuItem value="TOYS">Toys</MenuItem>
                <MenuItem value="BOOKS">Books</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Price (VND)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                inputProps={{ min: 0, step: 1000 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                <MenuItem value="PCS">Pieces</MenuItem>
                <MenuItem value="KG">Kilograms</MenuItem>
                <MenuItem value="L">Liters</MenuItem>
                <MenuItem value="M">Meters</MenuItem>
                <MenuItem value="BOX">Box</MenuItem>
                <MenuItem value="CARTON">Carton</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reorder Level"
                name="reorderLevel"
                type="number"
                value={formData.reorderLevel}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dimensions (LxWxH)"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="e.g., 10x20x30 cm"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {product ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductDialog;