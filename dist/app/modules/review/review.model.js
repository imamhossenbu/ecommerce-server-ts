"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    productID: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product" },
    userID: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });
exports.Review = (0, mongoose_1.model)('Review', reviewSchema);
//# sourceMappingURL=review.model.js.map