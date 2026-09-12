const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');

// ============ PUBLIC ROUTES ============

// REGISTER - Fixed (No double hashing)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        // ✅ Pass plain password — User.js model khud hash karega (pre('save') hook)
        const user = new User({
            name,
            email,
            password: password,
            phone: phone || '',
            role: 'customer',
            status: 'active',
            addresses: []
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// LOGIN - With debug logs
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('🔑 LOGIN ATTEMPT');
        console.log('📧 Email:', email);
        console.log('🔒 Password entered:', password);
        console.log('═══════════════════════════════════════');

        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ USER NOT FOUND in database');
            console.log('═══════════════════════════════════════');
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        console.log('✅ User found:', user.email);
        console.log('🔐 Stored hash in DB:', user.password);
        console.log('🔐 Hash length:', user.password?.length);

        const isValid = await bcrypt.compare(password, user.password);

        console.log('🔑 Password match result:', isValid);
        console.log('═══════════════════════════════════════');
        console.log('');

        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log('❌ LOGIN ERROR:', error.message);
        res.status(400).json({ success: false, error: error.message });
    }
});

// ============ FORGOT PASSWORD ============

// REQUEST PASSWORD RESET
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No account found with this email'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetTokenExpiry;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset link sent',
            resetToken,
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// RESET PASSWORD - Fixed (No double hashing)
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters'
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired reset token'
            });
        }

        // Hash once and use updateOne to bypass pre('save')
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    password: hashedPassword,
                    resetPasswordToken: null,
                    resetPasswordExpire: null
                }
            }
        );

        console.log('✅ Password reset for:', user.email);

        res.json({
            success: true,
            message: 'Password reset successfully. You can now login.'
        });
    } catch (error) {
        console.log('❌ Reset error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// ============ PROTECTED ROUTES ============

// GET USER PROFILE
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// UPDATE USER PROFILE
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (email) {
            const existingUser = await User.findOne({
                email,
                _id: { $ne: req.userId }
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'Email already in use'
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, email, phone },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// CHANGE PASSWORD
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Current and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'New password must be at least 6 characters'
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } }
        );

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// ============ ADDRESS ROUTES ============

// GET ALL ADDRESSES
router.get('/addresses', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('addresses');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, addresses: user.addresses || [] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ADD NEW ADDRESS
router.post('/addresses', auth, async (req, res) => {
    try {
        const { fullName, phone, addressLine, city, state, postalCode, country, isDefault } = req.body;

        if (!fullName || !phone || !addressLine || !city || !state || !postalCode || !country) {
            return res.status(400).json({
                success: false,
                error: 'All address fields are required'
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const newAddress = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            fullName,
            phone,
            addressLine,
            city,
            state,
            postalCode,
            country,
            isDefault: isDefault || user.addresses.length === 0
        };

        if (newAddress.isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({
            success: true,
            address: newAddress,
            addresses: user.addresses
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// UPDATE ADDRESS
router.put('/addresses/:addressId', auth, async (req, res) => {
    try {
        const { addressId } = req.params;
        const { fullName, phone, addressLine, city, state, postalCode, country, isDefault } = req.body;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const address = user.addresses.find(
            addr => addr.id === addressId || addr._id?.toString() === addressId
        );

        if (!address) {
            return res.status(404).json({ success: false, error: 'Address not found' });
        }

        if (isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        if (fullName) address.fullName = fullName;
        if (phone) address.phone = phone;
        if (addressLine) address.addressLine = addressLine;
        if (city) address.city = city;
        if (state) address.state = state;
        if (postalCode) address.postalCode = postalCode;
        if (country) address.country = country;
        if (isDefault !== undefined) address.isDefault = isDefault;

        await user.save();

        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE ADDRESS
router.delete('/addresses/:addressId', auth, async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const originalLength = user.addresses.length;
        user.addresses = user.addresses.filter(
            addr => addr.id !== addressId && addr._id?.toString() !== addressId
        );

        if (user.addresses.length === originalLength) {
            return res.status(404).json({ success: false, error: 'Address not found' });
        }

        if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// SET DEFAULT ADDRESS
router.put('/addresses/:addressId/default', auth, async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const address = user.addresses.find(
            addr => addr.id === addressId || addr._id?.toString() === addressId
        );

        if (!address) {
            return res.status(404).json({ success: false, error: 'Address not found' });
        }

        user.addresses.forEach(addr => {
            addr.isDefault = false;
        });
        address.isDefault = true;

        await user.save();

        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// ============ ADMIN ROUTES ============

// GET ALL USERS (Admin only)
router.get('/admin/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// UPDATE USER ROLE (Admin only)
router.put('/admin/users/:id/role', auth, isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE USER (Admin only)
router.delete('/admin/users/:id', auth, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;