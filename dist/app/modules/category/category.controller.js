"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getAllCategories = exports.createCategory = void 0;
const category_service_1 = require("./category.service");
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a category image" });
        }
        const result = await category_service_1.CategoryService.createCategoryInDB({
            name,
            image: req.file.path,
        });
        res.status(201).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCategory = createCategory;
const getAllCategories = async (req, res) => {
    try {
        const result = await category_service_1.CategoryService.getAllCategoriesFromDB(req.query);
        res.status(200).json({
            success: true,
            count: result.categories.length,
            totalCategories: result.totalCategories,
            totalPages: Math.ceil(result.totalCategories / result.limit),
            currentPage: result.page,
            data: result.categories,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllCategories = getAllCategories;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const isExist = await category_service_1.CategoryService.getCategoryById(id);
        if (!isExist) {
            return res.status(404).json({ success: false, message: "Category not found!" });
        }
        const updateData = { name };
        if (req.file) {
            updateData.image = req.file.path;
        }
        const result = await category_service_1.CategoryService.updateCategoryInDB(id, updateData);
        res.status(200).json({
            success: true,
            message: "Category updated successfully!",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const isExist = await category_service_1.CategoryService.getCategoryById(id);
        if (!isExist) {
            return res.status(404).json({ success: false, message: "Category not found!" });
        }
        await category_service_1.CategoryService.deleteCategoryFromDB(id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully!",
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.controller.js.map