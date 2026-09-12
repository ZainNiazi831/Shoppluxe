const jwt = require('jsonwebtoken');

// ============ AUTH MIDDLEWARE ============
module.exports = (req, res, next) => {
    // Header se token nikalo
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
};

// ============ ADMIN CHECK MIDDLEWARE ============
module.exports.isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Access denied. Admin only.'
        });
    }
    next();
};