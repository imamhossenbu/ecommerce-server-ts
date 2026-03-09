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
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userControllers = __importStar(require("./user.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const router = express_1.default.Router();
router.get('/me', auth_middleware_1.protect, userControllers.getLoggedUser);
router.put('/update-profile', auth_middleware_1.protect, cloudinary_config_1.upload.single('image'), userControllers.updateProfile);
router.post('/change-password', auth_middleware_1.protect, userControllers.changePassword);
router.post('/logout', auth_middleware_1.protect, userControllers.logout);
router.get('/all-users', auth_middleware_1.protect, admin_middleware_1.isAdmin, userControllers.getAllUsers);
router.delete('/:id', auth_middleware_1.protect, admin_middleware_1.isAdmin, userControllers.deleteUser);
exports.userRoutes = router;
//# sourceMappingURL=user.routes.js.map