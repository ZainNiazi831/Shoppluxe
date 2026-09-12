const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');

// ============ PUBLIC ROUTES ============

// ✅ GET all products with ADVANCED FILTERS
router.get('/', async (req, res) => {
    try {
        const {
            category,
            search,
            minPrice,
            maxPrice,
            minRating,
            inStock,
            onSale,
            sortBy,
            status = 'active'
        } = req.query;

        let query = { status };

        // Category filter
        if (category) {
            query.category = category;
        }

        // Search filter
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // ✅ Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // ✅ Rating filter (4+ stars, 3+ stars, etc.)
        if (minRating) {
            query.rating = { $gte: Number(minRating) };
        }

        // ✅ Availability filter (In Stock)
        if (inStock === 'true') {
            query.stockQuantity = { $gt: 0 };
        }

        // ✅ Discount filter (On Sale)
        if (onSale === 'true') {
            query.discountPercentage = { $gt: 0 };
        }

        // Sorting
        let sort = { createdAt: -1 };
        if (sortBy === 'price_asc') sort = { price: 1 };
        if (sortBy === 'price_desc') sort = { price: -1 };
        if (sortBy === 'rating') sort = { rating: -1 };
        if (sortBy === 'name') sort = { name: 1 };
        if (sortBy === 'newest') sort = { createdAt: -1 };

        const products = await Product.find(query).sort(sort);

        res.json({ success: true, products, total: products.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET categories
router.get('/categories/all', async (req, res) => {
    try {
        const categories = await Product.distinct('category', { status: 'active' });
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET single product
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid product ID format'
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ ADMIN ROUTES ============

// CREATE product (Admin only)
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const slug = req.body.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const product = new Product({ ...req.body, slug });
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// UPDATE product (Admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid product ID' });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE product (Admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid product ID' });
        }

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;