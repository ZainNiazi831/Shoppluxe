const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');

// ============ PUBLIC ROUTES ============

// GET all reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({
            productId: req.params.productId,
            status: 'approved'
        }).sort({ createdAt: -1 });

        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => {
            distribution[r.rating] = (distribution[r.rating] || 0) + 1;
        });

        res.json({
            success: true,
            reviews,
            averageRating: Number(averageRating.toFixed(1)),
            totalReviews: reviews.length,
            distribution
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ PROTECTED ROUTES ============

// ADD review
router.post('/', auth, async (req, res) => {
    try {
        const { productId, rating, comment, productName } = req.body;

        console.log('📝 New review request:', { productId, rating, comment, productName });

        if (!productId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: 'Rating must be between 1 and 5'
            });
        }

        const existingReview = await Review.findOne({
            productId,
            userId: req.userId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                error: 'You have already reviewed this product'
            });
        }

        const User = require('../models/User');
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // ✅ Get product name - Priority:
        // 1. From request (productName sent from frontend)
        // 2. From database (if valid ObjectId)
        // 3. Default 'Product'
        let finalProductName = productName || 'Product';

        if (productId && productId.match && productId.match(/^[0-9a-fA-F]{24}$/)) {
            try {
                const product = await Product.findById(productId);
                if (product) {
                    finalProductName = product.name;
                }
            } catch (err) {
                console.log('Could not fetch product name:', err.message);
            }
        }

        console.log('✅ Saving product name:', finalProductName);

        const review = new Review({
            productId,
            productName: finalProductName,
            userId: req.userId,
            userName: user.name,
            rating: Number(rating),
            comment,
            status: 'approved'
        });

        await review.save();

        res.status(201).json({
            success: true,
            review,
            message: 'Review added successfully'
        });
    } catch (error) {
        console.error('❌ Add review error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// UPDATE own review
router.put('/:reviewId', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        if (review.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                error: 'You can only edit your own reviews'
            });
        }

        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await review.save();

        res.json({ success: true, review });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE own review
router.delete('/:reviewId', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        if (review.userId.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'You can only delete your own reviews'
            });
        }

        await Review.findByIdAndDelete(req.params.reviewId);

        res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ ADMIN ROUTES ============

// GET ALL reviews (Admin)
router.get('/admin/all', auth, isAdmin, async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });

        const reviewsWithProducts = await Promise.all(
            reviews.map(async (review) => {
                try {
                    let productName = review.productName;

                    // If productName is missing or default, try to fetch from DB
                    if (!productName || productName === 'Product') {
                        if (review.productId && review.productId.match && review.productId.match(/^[0-9a-fA-F]{24}$/)) {
                            const product = await Product.findById(review.productId).select('name');
                            if (product) {
                                productName = product.name;
                            }
                        }
                    }

                    return {
                        ...review.toObject(),
                        productName: productName || 'Product'
                    };
                } catch (err) {
                    return {
                        ...review.toObject(),
                        productName: review.productName || 'Product'
                    };
                }
            })
        );

        res.json({ success: true, reviews: reviewsWithProducts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// UPDATE review status (Admin)
router.put('/admin/:reviewId/status', auth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['approved', 'pending', 'hidden'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const review = await Review.findByIdAndUpdate(
            req.params.reviewId,
            { status },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        res.json({ success: true, review });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE review (Admin)
router.delete('/admin/:reviewId', auth, isAdmin, async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;