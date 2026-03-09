"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_model_1 = require("./product.model");
const review_model_1 = require("../review/review.model");
const createProductInDB = async (productData) => {
    return await product_model_1.Product.create(productData);
};
const getProductDetailsFromDB = async (id) => {
    const product = await product_model_1.Product.findById(id).populate("categoryID", "name");
    if (!product)
        return null;
    const reviews = await review_model_1.Review.find({ productID: id });
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
        ? (reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews).toFixed(1)
        : 0;
    return {
        product,
        totalReviews,
        avgRating: Number(avgRating)
    };
};
const getAllProductsFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;
    const keyword = query.search ? { name: { $regex: query.search, $options: "i" } } : {};
    const category = query.category ? { categoryID: query.category } : {};
    let sortBy = { createdAt: -1 };
    if (query.sort) {
        if (query.sort === 'price')
            sortBy = { salePrice: 1 };
        else if (query.sort === '-price')
            sortBy = { salePrice: -1 };
        else if (query.sort === 'name')
            sortBy = { name: 1 };
        else if (query.sort === '-name')
            sortBy = { name: -1 };
    }
    const filter = { ...keyword, ...category };
    const totalProducts = await product_model_1.Product.countDocuments(filter);
    const products = await product_model_1.Product.find(filter)
        .populate("categoryID", "name")
        .limit(limit)
        .skip(skip)
        .sort(sortBy);
    return { products, totalProducts, page, limit };
};
const deleteProductFromDB = async (id) => {
    return await product_model_1.Product.findByIdAndDelete(id);
};
const getBestsellersFromDB = async () => {
    return await product_model_1.Product.find({ isBestseller: true })
        .populate("categoryID", "name")
        .limit(4)
        .sort({ createdAt: -1 });
};
const getNewArrivalsFromDB = async () => {
    return await product_model_1.Product.find()
        .populate("categoryID", "name")
        .sort({ createdAt: -1 })
        .limit(4);
};
const updateProductInDB = async (id, updateData) => {
    return await product_model_1.Product.findByIdAndUpdate(id, updateData, { new: true });
};
exports.ProductService = {
    createProductInDB,
    getProductDetailsFromDB,
    getAllProductsFromDB,
    deleteProductFromDB,
    getBestsellersFromDB,
    getNewArrivalsFromDB,
    updateProductInDB
};
//# sourceMappingURL=product.service.js.map