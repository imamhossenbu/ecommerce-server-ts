"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const user_routes_1 = require("../modules/user/user.routes");
const product_routes_1 = require("../modules/product/product.routes");
const category_routes_1 = require("../modules/category/category.routes");
const order_routes_1 = require("../modules/order/order.routes");
const review_routes_1 = require("../modules/review/review.routes");
const upload_routes_1 = require("../modules/upload/upload.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_routes_1.authRoutes,
    },
    {
        path: '/users',
        route: user_routes_1.userRoutes,
    },
    {
        path: '/products',
        route: product_routes_1.productRoutes
    },
    {
        path: '/categories',
        route: category_routes_1.categoryRoutes,
    },
    {
        path: '/payment',
        route: order_routes_1.orderRoutes
    },
    {
        path: '/reviews',
        route: review_routes_1.reviewRoutes,
    },
    {
        path: '/uploads',
        route: upload_routes_1.uploadRoutes,
    },
    {
        path: '/admin',
        route: admin_routes_1.adminRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=index.js.map