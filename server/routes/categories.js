const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');

// ============ PUBLIC ROUTES ============

// GET all categories with product counts
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const count = await Product.countDocuments({
                    category: cat.name,
                    status: 'active'
                });
                return {
                    ...cat.toObject(),
                    productCount: count
                };
            })
        );

        res.json({ success: true, categories: categoriesWithCount });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET single category
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }
        res.json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ ADMIN ROUTES ============

// CREATE category
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, error: 'Category name is required' });
        }

        const existing = await Category.findOne({ name });
        if (existing) {
            return res.status(400).json({ success: false, error: 'Category already exists' });
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        const category = new Category({
            name,
            slug,
            description: description || '',
            image: image || '',
            status: 'active'
        });

        await category.save();

        res.status(201).json({ success: true, category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// UPDATE category
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { name, description, image, status } = req.body;

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }

        if (name) {
            category.name = name;
            category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }
        if (description !== undefined) category.description = description;
        if (image !== undefined) category.image = image;
        if (status) category.status = status;

        await category.save();

        res.json({ success: true, category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE category
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }

        const productCount = await Product.countDocuments({ category: category.name });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                error: `Cannot delete: ${productCount} products exist in this category`
            });
        }

        await Category.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;