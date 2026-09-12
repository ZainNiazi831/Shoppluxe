import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Box,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Button,
    FormControlLabel,
    Checkbox,
    Rating,
    Divider,
} from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';
import ProductCard from './ProductCard';
import { ProductService } from '../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        category: '',
        sortBy: 'newest',
        minPrice: '',
        maxPrice: '',
        minRating: '',
        inStock: false,
        onSale: false,
    });

    const location = useLocation();
    const navigate = useNavigate();

    // ✅ Get search query from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('search');
        console.log('🔍 URL Search Query:', searchQuery);

        if (searchQuery) {
            setFilters(prev => ({ ...prev, search: searchQuery }));
        } else {
            setFilters(prev => ({ ...prev, search: '' }));
        }
    }, [location]);

    // ✅ Load categories
    useEffect(() => {
        loadCategories();
    }, []);

    // ✅ Load products
    useEffect(() => {
        loadProducts();
    }, [filters]);

    const loadCategories = async () => {
        try {
            const result = await ProductService.getCategories();
            if (result.success) {
                setCategories(result.categories || []);
            }
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const apiFilters = {};

            if (filters.search && filters.search.trim()) {
                apiFilters.search = filters.search.trim();
            }
            if (filters.category) apiFilters.category = filters.category;
            if (filters.minPrice) apiFilters.minPrice = filters.minPrice;
            if (filters.maxPrice) apiFilters.maxPrice = filters.maxPrice;
            if (filters.minRating) apiFilters.minRating = filters.minRating;
            if (filters.inStock) apiFilters.inStock = 'true';
            if (filters.onSale) apiFilters.onSale = 'true';
            if (filters.sortBy) apiFilters.sortBy = filters.sortBy;

            console.log('🔍 Sending API Filters:', apiFilters);

            const result = await ProductService.getAll(apiFilters);

            console.log('📦 Received Products:', result.products?.length);
            console.log('📦 Products:', result.products);

            if (result.success) {
                setProducts(result.products || []);
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error('❌ Error:', err);
            setError('Failed to load products');
        }
        setLoading(false);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearAllFilters = () => {
        setFilters({
            search: '',
            category: '',
            sortBy: 'newest',
            minPrice: '',
            maxPrice: '',
            minRating: '',
            inStock: false,
            onSale: false,
        });
        navigate('/products');
    };

    const activeFilterCount = () => {
        let count = 0;
        if (filters.category) count++;
        if (filters.minPrice || filters.maxPrice) count++;
        if (filters.minRating) count++;
        if (filters.inStock) count++;
        if (filters.onSale) count++;
        return count;
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                    {filters.search ? `Search: "${filters.search}"` : 'All Products'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterList />}
                        onClick={() => setShowFilters(!showFilters)}
                        sx={{ borderRadius: '25px', textTransform: 'none', fontWeight: 600 }}
                    >
                        Filters {activeFilterCount() > 0 && `(${activeFilterCount()})`}
                    </Button>

                    {(activeFilterCount() > 0 || filters.search) && (
                        <Button
                            variant="text"
                            startIcon={<Close />}
                            onClick={clearAllFilters}
                            sx={{ borderRadius: '25px', textTransform: 'none', color: '#dc2626' }}
                        >
                            Clear All
                        </Button>
                    )}
                </Box>
            </Box>

            <Grid container spacing={3}>
                {showFilters && (
                    <Grid item xs={12} md={3}>
                        <Box sx={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            p: 3,
                            boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Filters
                            </Typography>

                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                                Category
                            </Typography>
                            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                <Select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="">All Categories</MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                                Price Range
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                <TextField
                                    label="Min"
                                    type="number"
                                    size="small"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                />
                                <TextField
                                    label="Max"
                                    type="number"
                                    size="small"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                                Minimum Rating
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                                {[4, 3, 2, 1].map((rating) => (
                                    <Box
                                        key={rating}
                                        onClick={() => handleFilterChange('minRating', filters.minRating === rating ? '' : rating)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            cursor: 'pointer',
                                            padding: '6px 10px',
                                            borderRadius: '8px',
                                            backgroundColor: filters.minRating === rating ? '#C8D9E6' : 'transparent',
                                            '&:hover': { backgroundColor: '#f0f2f5' },
                                        }}
                                    >
                                        <Rating value={rating} readOnly size="small" />
                                        <Typography variant="body2">& up</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                                Availability
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filters.inStock}
                                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                                    />
                                }
                                label="In Stock Only"
                                sx={{ mb: 1, display: 'block' }}
                            />

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                                Discount
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filters.onSale}
                                        onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                                    />
                                }
                                label="On Sale"
                                sx={{ display: 'block' }}
                            />
                        </Box>
                    </Grid>
                )}

                <Grid item xs={12} md={showFilters ? 9 : 12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Showing {products.length} product{products.length !== 1 ? 's' : ''}
                        </Typography>

                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={filters.sortBy}
                                label="Sort By"
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            >
                                <MenuItem value="newest">Newest First</MenuItem>
                                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                                <MenuItem value="rating">Top Rated</MenuItem>
                                <MenuItem value="name">Name: A to Z</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress size={60} />
                        </Box>
                    )}

                    {error && !loading && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography color="error" variant="h6">{error}</Typography>
                            <Button variant="contained" onClick={loadProducts} sx={{ mt: 2 }}>Retry</Button>
                        </Box>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>No Products Found</Typography>
                            <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>Try adjusting your search or filters</Typography>
                            <Button variant="contained" onClick={clearAllFilters}>Clear All Filters</Button>
                        </Box>
                    )}

                    {!loading && !error && products.length > 0 && (
                        <Grid container spacing={3}>
                            {products.map((product) => (
                                <Grid item xs={12} sm={6} md={4} key={product._id}>
                                    <ProductCard product={product} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductList;