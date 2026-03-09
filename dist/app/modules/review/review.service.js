"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const review_model_1 = require("./review.model");
const product_model_1 = require("../product/product.model");
const addReviewInDB = async (payload) => {
    const newReview = await review_model_1.Review.create(payload);
    const allReviews = await review_model_1.Review.find({ productID: payload.productID });
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avgRating = Number((totalRating / allReviews.length).toFixed(1));
    await product_model_1.Product.findByIdAndUpdate(payload.productID, {
        avgRating: avgRating,
        totalReviews: allReviews.length
    });
    return newReview;
};
const getProductReviewsFromDB = async (productId) => {
    return await review_model_1.Review.find({ productID: productId })
        .populate('userID', 'name profileImage')
        .sort({ createdAt: -1 });
};
const getHomeReviewsFromDB = async () => {
    return await review_model_1.Review.find()
        .populate({
        path: 'userID',
        select: 'name profileImage',
        model: 'User'
    })
        .populate('productID', 'name')
        .sort({ createdAt: -1 })
        .limit(4);
};
exports.ReviewService = {
    addReviewInDB,
    getProductReviewsFromDB,
    getHomeReviewsFromDB
};
//# sourceMappingURL=review.service.js.map