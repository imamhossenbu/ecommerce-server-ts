"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const order_model_1 = require("../order/order.model");
const user_model_1 = require("../user/user.model");
const product_model_1 = require("../product/product.model");
const getDashboardStatsFromDB = async () => {
    const totalOrders = await order_model_1.Order.countDocuments({ paymentStatus: "Paid" });
    const totalCustomers = await user_model_1.User.countDocuments({ role: "user" });
    const orders = await order_model_1.Order.find({ paymentStatus: "Paid" });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
    const recentOrders = await order_model_1.Order.find().sort({ createdAt: -1 }).limit(5);
    const topProducts = await product_model_1.Product.find().limit(5);
    const rawSalesData = await order_model_1.Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        {
            $group: {
                _id: { $month: "$createdAt" },
                revenue: { $sum: "$totalAmount" },
            },
        },
        { $sort: { "_id": 1 } }
    ]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const salesData = monthNames.map((month, index) => {
        const monthNumber = index + 1;
        const foundMonth = rawSalesData.find(item => item._id === monthNumber);
        return { name: month, revenue: foundMonth ? foundMonth.revenue : 0 };
    });
    return { stats: { totalRevenue, totalOrders, totalCustomers, avgOrderValue }, recentOrders, topProducts, salesData };
};
const getManageCustomersFromDB = async (query) => {
    const { page = 1, limit = 10, search = "", status = "" } = query;
    const skip = (Number(page) - 1) * Number(limit);
    let filter = { role: "user" };
    if (search) {
        filter.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ];
    }
    if (status)
        filter.status = status;
    const customers = await user_model_1.User.find(filter).select("-password").skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const customerData = await Promise.all(customers.map(async (user) => {
        const stats = await order_model_1.Order.aggregate([
            { $match: { "customerInfo.email": user.email } },
            { $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: "$totalAmount" },
                    lastActive: { $max: "$createdAt" }
                } }
        ]);
        return {
            ...user.toObject(),
            ordersCount: stats[0]?.totalOrders || 0,
            totalSpent: stats[0]?.totalSpent || 0,
            lastActive: stats[0]?.lastActive || user.createdAt
        };
    }));
    const totalCustomers = await user_model_1.User.countDocuments({ role: "user" });
    return { customerData, totalCustomers, limit: Number(limit) };
};
exports.AdminService = {
    getDashboardStatsFromDB,
    getManageCustomersFromDB
};
//# sourceMappingURL=admin.service.js.map