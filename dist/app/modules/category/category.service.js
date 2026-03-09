"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_model_1 = require("./category.model");
const product_model_1 = require("../product/product.model");
const createCategoryInDB = async (payload) => {
    return await category_model_1.Category.create(payload);
};
const getAllCategoriesFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;
    const keyword = query.search
        ? { name: { $regex: query.search, $options: "i" } }
        : {};
    const totalCategories = await category_model_1.Category.countDocuments({ ...keyword });
    const categories = await category_model_1.Category.find({ ...keyword })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });
    return {
        categories,
        totalCategories,
        page,
        limit,
    };
};
const updateCategoryInDB = async (id, updateData) => {
    return await category_model_1.Category.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};
const deleteCategoryFromDB = async (id) => {
    const productCount = await product_model_1.Product.countDocuments({ categoryID: id });
    if (productCount > 0) {
        throw new Error("Cannot delete category with active products");
    }
    return await category_model_1.Category.findByIdAndDelete(id);
};
const getCategoryById = async (id) => {
    return await category_model_1.Category.findById(id);
};
exports.CategoryService = {
    createCategoryInDB,
    getAllCategoriesFromDB,
    updateCategoryInDB,
    deleteCategoryFromDB,
    getCategoryById,
};
//# sourceMappingURL=category.service.js.map