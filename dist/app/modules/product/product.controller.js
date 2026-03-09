"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.getNewArrivals = exports.getBestsellers = exports.deleteProduct = exports.getAllProducts = exports.getProductDetails = exports.createProduct = void 0;
const product_service_1 = require("./product.service");
const createProduct = async (req, res) => {
    try {
        const { thumbnail, images, regularPrice, salePrice, stock, isFeatured, isBestseller, isNew, lowdown, ...rest } = req.body;
        if (!thumbnail)
            return res.status(400).json({ success: false, message: "Main thumbnail image is required!" });
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ success: false, message: "At least one gallery image is required!" });
        }
        const productData = {
            ...rest,
            regularPrice: Number(regularPrice),
            salePrice: Number(salePrice),
            thumbnail,
            images,
            stock: Number(stock) || 0,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            isBestseller: isBestseller === 'true' || isBestseller === true,
            isNew: isNew === 'true' || isNew === true,
            lowdown: Array.isArray(lowdown) ? lowdown : [lowdown]
        };
        const product = await product_service_1.ProductService.createProductInDB(productData);
        res.status(201).json({ success: true, message: "Product created successfully!", data: product });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createProduct = createProduct;
const getProductDetails = async (req, res) => {
    try {
        const result = await product_service_1.ProductService.getProductDetailsFromDB(req.params.id);
        if (!result)
            return res.status(404).json({ success: false, message: "Product not found!" });
        res.status(200).json({
            success: true,
            data: { ...result.product.toObject(), totalReviews: result.totalReviews, avgRating: result.avgRating }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProductDetails = getProductDetails;
const getAllProducts = async (req, res) => {
    try {
        const { products, totalProducts, page, limit } = await product_service_1.ProductService.getAllProductsFromDB(req.query);
        res.status(200).json({
            success: true,
            count: products.length,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllProducts = getAllProducts;
const deleteProduct = async (req, res) => {
    try {
        const result = await product_service_1.ProductService.deleteProductFromDB(req.params.id);
        if (!result)
            return res.status(404).json({ success: false, message: "Product not found!" });
        res.status(200).json({ success: true, message: "Product deleted successfully!" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
const getBestsellers = async (req, res) => {
    try {
        const products = await product_service_1.ProductService.getBestsellersFromDB();
        res.status(200).json({ success: true, count: products.length, data: products });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getBestsellers = getBestsellers;
const getNewArrivals = async (req, res) => {
    try {
        const products = await product_service_1.ProductService.getNewArrivalsFromDB();
        res.status(200).json({ success: true, count: products.length, data: products });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getNewArrivals = getNewArrivals;
const updateProduct = async (req, res) => {
    try {
        let updateData = { ...req.body };
        const files = req.files;
        if (files) {
            if (files.thumbnail)
                updateData.thumbnail = files.thumbnail[0].path;
            if (files.images)
                updateData.images = files.images.map((file) => file.path);
        }
        const updatedProduct = await product_service_1.ProductService.updateProductInDB(req.params.id, updateData);
        if (!updatedProduct)
            return res.status(404).json({ success: false, message: "Product not found" });
        res.status(200).json({ success: true, data: updatedProduct });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProduct = updateProduct;
//# sourceMappingURL=product.controller.js.map