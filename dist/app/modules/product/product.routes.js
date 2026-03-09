"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const productControllers = __importStar(require("./product.controller"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
const router = express_1.default.Router();
const productUpload = cloudinary_config_1.upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
]);
router.post("/create-product", auth_middleware_1.protect, admin_middleware_1.isAdmin, productUpload, productControllers.createProduct);
router.get("/", productControllers.getAllProducts);
router.get("/bestsellers", productControllers.getBestsellers);
router.get("/new-arrivals", productControllers.getNewArrivals);
router.get("/:id", productControllers.getProductDetails);
router.put("/:id", auth_middleware_1.protect, admin_middleware_1.isAdmin, productUpload, productControllers.updateProduct);
router.delete("/:id", auth_middleware_1.protect, admin_middleware_1.isAdmin, productControllers.deleteProduct);
exports.productRoutes = router;
//# sourceMappingURL=product.routes.js.map