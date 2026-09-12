const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');

// ============ CREATE ORDER (Public - no auth needed) ============
router.post('/', async (req, res) => {
    try {
        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('📦 NEW ORDER RECEIVED');
        console.log('📋 Data:', JSON.stringify(req.body, null, 2));
        console.log('═══════════════════════════════════════');

        const orderData = {
            ...req.body,
            orderNumber: req.body.orderNumber || 'ORD-' + Date.now(),
            createdAt: new Date().toISOString()
        };

        const order = new Order(orderData);
        await order.save();

        console.log('✅ ORDER SAVED TO MONGODB');
        console.log('🔢 Order Number:', order.orderNumber);
        console.log('🆔 Order ID:', order._id);
        console.log('═══════════════════════════════════════');
        console.log('');

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.log('❌ ORDER SAVE ERROR:', error.message);
        res.status(400).json({ success: false, error: error.message });
    }
});

// ============ GET ALL ORDERS (Admin only) ============
router.get('/admin/all', auth, isAdmin, async (req, res) => {
    try {
        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('📦 ADMIN - GET ALL ORDERS');
        console.log('👤 Admin ID:', req.userId);
        console.log('🎭 Role:', req.userRole);
        console.log('═══════════════════════════════════════');

        const orders = await Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        console.log('✅ Orders found:', orders.length);
        console.log('═══════════════════════════════════════');
        console.log('');

        res.json({ success: true, orders });
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ GET USER'S OWN ORDERS ============
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ GET SINGLE ORDER ============
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email');
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ UPDATE ORDER STATUS (Admin only) ============
router.put('/:id/status', auth, isAdmin, async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true, runValidators: true }
        );
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.json({ success: true, order });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// ============ DELETE ORDER (Admin only) ============
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;