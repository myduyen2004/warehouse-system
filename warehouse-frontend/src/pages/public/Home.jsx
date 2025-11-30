import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Avatar,
} from '@mui/material';
import {
  LocalShipping,
  Verified,
  Support,
  ShoppingBag,
  TrendingUp,
  Speed,
  Security,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Speed sx={{ fontSize: 48, color: '#F97316' }} />,
      title: 'Fast Delivery',
      description: '2-3 days nationwide shipping with real-time tracking',
    },
    {
      icon: <Security sx={{ fontSize: 48, color: '#F59E0B' }} />,
      title: 'Secure Storage',
      description: 'Modern warehouses with 24/7 security surveillance',
    },
    {
      icon: <AttachMoney sx={{ fontSize: 48, color: '#10B981' }} />,
      title: 'Best Prices',
      description: 'Competitive pricing with bulk order discounts',
    },
    {
      icon: <Support sx={{ fontSize: 48, color: '#3B82F6' }} />,
      title: '24/7 Support',
      description: 'Customer support available round the clock',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Happy Customers', color: '#F97316' },
    { value: '20+', label: 'Warehouses', color: '#F59E0B' },
    { value: '100K+', label: 'Products Delivered', color: '#10B981' },
    { value: '99%', label: 'Success Rate', color: '#3B82F6' },
  ];

  const categories = [
    { name: 'Electronics', icon: '📱', count: 450, color: '#F97316' },
    { name: 'Clothing', icon: '👕', count: 320, color: '#F59E0B' },
    { name: 'Food & Beverage', icon: '🍔', count: 180, color: '#10B981' },
    { name: 'Furniture', icon: '🛋️', count: 240, color: '#3B82F6' },
    { name: 'Books', icon: '📚', count: 560, color: '#EF4444' },
    { name: 'Toys & Games', icon: '🧸', count: 290, color: '#8B5CF6' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)',
          color: 'white',
          py: { xs: 8, md: 15 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip 
                label="🚀 NEW: Same-day delivery available!" 
                sx={{ 
                  mb: 2, 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 600,
                }} 
              />
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                Your Trusted Warehouse Partner
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.95 }}>
                Fast, reliable logistics and storage solutions for your business needs
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingBag />}
                  onClick={() => navigate('/shop')}
                  sx={{
                    backgroundColor: 'white',
                    color: '#F97316',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    '&:hover': { 
                      backgroundColor: '#FFF7ED',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<LocalShipping />}
                  onClick={() => navigate('/track')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderWidth: 2,
                    '&:hover': { 
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderWidth: 2,
                    },
                  }}
                >
                  Track Order
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600"
                alt="Warehouse"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                  border: `2px solid ${stat.color}30`,
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ backgroundColor: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Why Choose WareHub?
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Professional logistics solutions tailored for your success
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: 'grey.200',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: 'primary.main',
                      boxShadow: '0 12px 28px rgba(249, 115, 22, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Shop by Category
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Thousands of products across multiple categories
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {categories.map((category, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: 3,
                  transition: 'all 0.3s',
                  border: '2px solid transparent',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    borderColor: category.color,
                    boxShadow: `0 8px 24px ${category.color}40`,
                  },
                }}
                onClick={() => navigate('/shop')}
              >
                <CardContent>
                  <Typography variant="h2" sx={{ mb: 1 }}>
                    {category.icon}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    {category.name}
                  </Typography>
                  <Chip
                    label={`${category.count}+ items`}
                    size="small"
                    sx={{ 
                      bgcolor: `${category.color}20`,
                      color: category.color,
                      fontWeight: 600,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Box sx={{ backgroundColor: '#1F2937', color: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              What Our Customers Say
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8 }}>
              Join thousands of satisfied customers
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              {
                name: 'John Smith',
                role: 'Business Owner',
                text: 'Fast delivery and excellent customer service. Highly recommended!',
                rating: 5,
              },
              {
                name: 'Sarah Johnson',
                role: 'E-commerce Manager',
                text: 'Best warehouse solution for our business. Very reliable.',
                rating: 5,
              },
              {
                name: 'Mike Chen',
                role: 'Store Manager',
                text: 'Professional service and competitive pricing. Great experience!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    height: '100%',
                    background: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)',
                    color: 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Typography key={i} sx={{ color: '#F59E0B', fontSize: '1.5rem' }}>
                        ⭐
                      </Typography>
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "{testimonial.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#F97316', width: 48, height: 48 }}>
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
            Join thousands of businesses trusting WareHub for their logistics needs
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<TrendingUp />}
              onClick={() => navigate('/shop')}
              sx={{
                backgroundColor: 'white',
                color: '#F97316',
                fontWeight: 700,
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': { 
                  backgroundColor: '#FFF7ED',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Start Shopping
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 700,
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                borderWidth: 2,
                '&:hover': { 
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderWidth: 2,
                },
              }}
            >
              Create Account
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;