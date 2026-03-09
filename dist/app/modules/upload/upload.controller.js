"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleImages = exports.uploadImage = void 0;
const upload_service_1 = require("./upload.service");
const uploadImage = async (req, res) => {
    try {
        const imageUrl = upload_service_1.UploadService.processSingleFile(req.file);
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: "No file selected!",
            });
        }
        res.status(200).json({
            success: true,
            message: "Image uploaded successfully!",
            url: imageUrl,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error, please try again.",
            error: error.message,
        });
    }
};
exports.uploadImage = uploadImage;
const uploadMultipleImages = async (req, res) => {
    try {
        const imageUrls = upload_service_1.UploadService.processMultipleFiles(req.files);
        if (imageUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files selected!",
            });
        }
        res.status(200).json({
            success: true,
            message: "Images uploaded successfully!",
            urls: imageUrls,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Upload failed!",
            error: error.message,
        });
    }
};
exports.uploadMultipleImages = uploadMultipleImages;
//# sourceMappingURL=upload.controller.js.map