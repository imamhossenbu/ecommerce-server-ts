"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = exports.logout = exports.changePassword = exports.updateProfile = exports.getLoggedUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_service_1 = require("./user.service");
const getLoggedUser = async (req, res) => {
    try {
        res.status(200).json({ success: true, data: req.user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getLoggedUser = getLoggedUser;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updateData = { ...req.body };
        if (req.file) {
            updateData.profileImage = req.file.path;
        }
        const updatedUser = await user_service_1.UserService.updateProfileInDB(userId, updateData);
        res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedUser });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;
        const user = await user_service_1.UserService.findUserById(userId);
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(newPassword, salt);
        await user.save();
        res.status(200).json({ success: true, message: "Password changed successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.changePassword = changePassword;
const logout = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error during logout' });
    }
};
exports.logout = logout;
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 20;
        const searchKey = req.query.search || "";
        const result = await user_service_1.UserService.getAllUsersFromDB(page, perPage, searchKey);
        res.status(200).json({
            success: true,
            data: result.users,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await user_service_1.UserService.deleteUserFromDB(id);
        if (!result) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map