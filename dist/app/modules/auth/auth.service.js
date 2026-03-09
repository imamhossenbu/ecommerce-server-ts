"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_model_1 = require("../user/user.model");
const findUserByEmail = async (email) => {
    return await user_model_1.User.findOne({ email });
};
const createUserInDB = async (userData) => {
    return await user_model_1.User.create(userData);
};
const findUserByResetToken = async (hashedToken) => {
    return await user_model_1.User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    });
};
exports.AuthService = {
    findUserByEmail,
    createUserInDB,
    findUserByResetToken,
};
//# sourceMappingURL=auth.service.js.map