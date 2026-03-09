"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getMyOrders = exports.paymentCancel = exports.paymentFail = exports.paymentSuccess = exports.createCheckoutSession = void 0;
const order_service_1 = require("./order.service");
const createCheckoutSession = async (req, res) => {
    try {
        const { customerInfo, items, totalAmount, shippingFee } = req.body;
        const transactionId = `TXN-${Date.now()}`;
        const paymentData = {
            total_amount: parseFloat(totalAmount),
            currency: 'BDT',
            tran_id: transactionId,
            success_url: `${process.env.BACKEND_URL}/api/v1/orders/payment/success/${transactionId}`,
            fail_url: `${process.env.BACKEND_URL}/api/v1/orders/payment/fail/${transactionId}`,
            cancel_url: `${process.env.BACKEND_URL}/api/v1/orders/payment/cancel/${transactionId}`,
            shipping_method: 'Courier',
            product_name: 'Skincare Products',
            product_category: 'Skincare',
            product_profile: 'general',
            cus_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            cus_email: customerInfo.email,
            cus_phone: customerInfo.phone,
            cus_add1: customerInfo.address || 'Dhaka',
            cus_city: customerInfo.city || 'Dhaka',
            cus_country: 'Bangladesh',
            ship_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            ship_add1: customerInfo.address || 'Dhaka',
            ship_city: customerInfo.city || 'Dhaka',
            ship_country: 'Bangladesh',
        };
        await order_service_1.OrderService.createOrderInDB({
            customerInfo, items, totalAmount, shippingFee, transactionId, paymentStatus: 'Pending'
        });
        const apiResponse = await order_service_1.OrderService.initPayment(paymentData);
        if (apiResponse?.GatewayPageURL) {
            res.status(200).json({ success: true, url: apiResponse.GatewayPageURL });
        }
        else {
            res.status(400).json({ success: false, message: "SSLCommerz session failed" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCheckoutSession = createCheckoutSession;
const paymentSuccess = async (req, res) => {
    const { tranId } = req.params;
    await order_service_1.OrderService.updateOrderPaymentStatus(tranId, 'Paid');
    res.redirect(`${process.env.FRONTEND_URL}/success`);
};
exports.paymentSuccess = paymentSuccess;
const paymentFail = async (req, res) => {
    const { tranId } = req.params;
    await order_service_1.OrderService.deleteOrderByTranId(tranId);
    res.redirect(`${process.env.FRONTEND_URL}/cancel`);
};
exports.paymentFail = paymentFail;
const paymentCancel = async (req, res) => {
    const { tranId } = req.params;
    await order_service_1.OrderService.updateOrderPaymentStatus(tranId, 'Cancelled');
    res.redirect(`${process.env.FRONTEND_URL}/cancel`);
};
exports.paymentCancel = paymentCancel;
const getMyOrders = async (req, res) => {
    try {
        const orders = await order_service_1.OrderService.getOrdersByEmail(req.user.email);
        res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyOrders = getMyOrders;
const getAllOrders = async (req, res) => {
    try {
        const result = await order_service_1.OrderService.getAllOrdersFromDB(req.query);
        res.status(200).json({
            success: true,
            totalOrders: result.totalOrders,
            totalPages: Math.ceil(result.totalOrders / result.limit),
            currentPage: result.page,
            stats: result.summary,
            data: result.orders
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res) => {
    try {
        const result = await order_service_1.OrderService.updateOrderStatusInDB(req.params.id, req.body.status);
        if (!result)
            return res.status(404).json({ success: false, message: "Order not found" });
        res.status(200).json({ success: true, message: "Status updated", data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.controller.js.map