"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    const user = req.user;
    console.log('Checking Admin access for:', user?.email);
    if (user && user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied, admin only' });
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=admin.middleware.js.map