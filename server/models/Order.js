const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
        required: false
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        productId: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, default: '' }
    }],
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    shippingAddress: {
        fullName: String,
        phone: String,
        addressLine: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    paymentMethod: {
        type: String,
        default: 'cod',
        enum: ['cod', 'credit_card', 'card', 'paypal']
    },
    paymentStatus: {
        type: String,
        default: 'pending',
        enum: ['pending', 'paid', 'failed', 'refunded']
    },
    orderStatus: {
        type: String,
        default: 'pending',
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);