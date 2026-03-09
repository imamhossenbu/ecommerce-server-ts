"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    customerInfo: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    items: [{
            productID: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            price: Number,
            quantity: Number,
            image: String
        }],
    totalAmount: Number,
    shippingFee: Number,
    transactionId: String,
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Cancelled'],
        default: 'Pending'
    },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    }
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
//# sourceMappingURL=order.model.js.map