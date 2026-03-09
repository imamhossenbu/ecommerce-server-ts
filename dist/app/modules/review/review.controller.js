"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomeReviews = exports.getProductReviews = exports.addReview = void 0;
const review_service_1 = require("./review.service");
const addReview = async (req, res) => {
    try {
        const { productID, userID, rating, comment } = req.body;
        const result = await review_service_1.ReviewService.addReviewInDB({
            productID,
            userID,
            rating: Number(rating),
            comment
        });
        res.status(201).json({
            success: true,
            message: "Review added successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.addReview = addReview;
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const result = await review_service_1.ReviewService.getProductReviewsFromDB(productId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProductReviews = getProductReviews;
const getHomeReviews = async (req, res) => {
    try {
        const result = await review_service_1.ReviewService.getHomeReviewsFromDB();
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getHomeReviews = getHomeReviews;
//# sourceMappingURL=review.controller.js.map