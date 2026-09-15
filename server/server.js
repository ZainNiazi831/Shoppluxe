const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ============ MIDDLEWARE ============
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        /\.vercel\.app$/,
        /\.railway\.app$/
    ],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============ REQUEST LOGGER ============
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// ============ MONGODB CONNECTION ============
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.log('❌ MongoDB Error:', err.message));

// ============ ROOT ROUTE ============
app.get('/', (req, res) => {
    res.json({
        message: '🚀 SHOPPLUXE API is running!',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            users: '/api/users',
            orders: '/api/orders',
            reviews: '/api/reviews',
            categories: '/api/categories'
        }
    });
});

// ============ API ROUTES ============
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/categories', require('./routes/categories'));

// ============ ERROR HANDLING ============
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
});

// ============ 404 HANDLER ============
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('═══════════════════════════════════════');
    console.log('');
});