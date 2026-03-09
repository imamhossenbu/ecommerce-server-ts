"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminSettings = exports.deleteUser = exports.getManageCustomers = exports.getDashboardStats = void 0;
const admin_service_1 = require("./admin.service");
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getDashboardStats = async (req, res) => {
    try {
        const data = await admin_service_1.AdminService.getDashboardStatsFromDB();
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
const getManageCustomers = async (req, res) => {
    try {
        const { customerData, totalCustomers, limit } = await admin_service_1.AdminService.getManageCustomersFromDB(req.query);
        res.status(200).json({
            success: true,
            data: customerData,
            totalPages: Math.ceil(totalCustomers / limit),
            totalCustomers
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getManageCustomers = getManageCustomers;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user._id.toString() === id) {
            return res.status(400).json({ success: false, message: "You cannot delete your own admin account!" });
        }
        const user = await user_model_1.User.findByIdAndDelete(id);
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, message: "Customer deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteUser = deleteUser;
const updateAdminSettings = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        const adminId = req.user._id;
        const admin = await user_model_1.User.findById(adminId);
        if (!admin)
            return res.status(404).json({ success: false, message: "Admin not found" });
        const updateData = {};
        if (email)
            updateData.email = email.toLowerCase();
        if (newPassword) {
            if (!currentPassword)
                return res.status(400).json({ success: false, message: "Current password is required" });
            const isMatch = await bcryptjs_1.default.compare(currentPassword, admin.password);
            if (!isMatch)
                return res.status(400).json({ success: false, message: "Current password is incorrect" });
            const salt = await bcryptjs_1.default.genSalt(10);
            updateData.password = await bcryptjs_1.default.hash(newPassword, salt);
        }
        const updatedAdmin = await user_model_1.User.findByIdAndUpdate(adminId, { $set: updateData }, { new: true });
        res.status(200).json({ success: true, message: "Settings updated", data: { email: updatedAdmin?.email } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateAdminSettings = updateAdminSettings;
//# sourceMappingURL=admin.controller.js.map