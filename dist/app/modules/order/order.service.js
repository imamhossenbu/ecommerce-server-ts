"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const order_model_1 = require("./order.model");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;
const createOrderInDB = async (orderData) => {
    return await order_model_1.Order.create(orderData);
};
const initPayment = async (data) => {
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    return await sslcz.init(data);
};
const updateOrderPaymentStatus = async (tranId, status) => {
    return await order_model_1.Order.findOneAndUpdate({ transactionId: tranId }, { paymentStatus: status });
};
const deleteOrderByTranId = async (tranId) => {
    return await order_model_1.Order.findOneAndDelete({ transactionId: tranId });
};
const getOrdersByEmail = async (email) => {
    return await order_model_1.Order.find({ "customerInfo.email": email }).sort({ createdAt: -1 });
};
const getOrderByIdFromDB = async (id) => {
    return await order_model_1.Order.findById(id);
};
const getAllOrdersFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    let filter = {};
    if (query.search) {
        const searchRegex = new RegExp(query.search, 'i');
        filter.$or = [
            { transactionId: searchRegex },
            { "customerInfo.firstName": searchRegex },
            { "customerInfo.email": searchRegex }
        ];
    }
    if (query.status)
        filter.paymentStatus = query.status;
    if (query.orderStatus)
        filter.orderStatus = query.orderStatus;
    const orders = await order_model_1.Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalOrders = await order_model_1.Order.countDocuments(filter);
    const stats = await order_model_1.Order.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$totalAmount", 0] } },
                totalOrders: { $sum: 1 },
                pendingOrders: { $sum: { $cond: [{ $eq: ["$paymentStatus", "Pending"] }, 1, 0] } }
            }
        }
    ]);
    const summary = stats.length > 0 ? stats[0] : { totalRevenue: 0, totalOrders: 0, pendingOrders: 0 };
    return { orders, totalOrders, page, limit, summary };
};
const updateOrderStatusInDB = async (id, status) => {
    return await order_model_1.Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
};
exports.OrderService = {
    createOrderInDB,
    initPayment,
    updateOrderPaymentStatus,
    deleteOrderByTranId,
    getOrdersByEmail,
    getOrderByIdFromDB,
    getAllOrdersFromDB,
    updateOrderStatusInDB
};
//# sourceMappingURL=order.service.js.map