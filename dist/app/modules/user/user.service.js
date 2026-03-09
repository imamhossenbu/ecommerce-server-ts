"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("./user.model");
const getAllUsersFromDB = async (page, perPage, searchKey) => {
    let filter = {};
    if (searchKey) {
        filter.$or = [
            { name: { $regex: searchKey, $options: "i" } },
            { email: { $regex: searchKey, $options: "i" } },
        ];
    }
    const total = await user_model_1.User.countDocuments(filter);
    const users = await user_model_1.User.find(filter)
        .select("-password")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
    return {
        users,
        pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    };
};
const updateProfileInDB = async (id, updateData) => {
    return await user_model_1.User.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after', runValidators: true }).select("-password");
};
const findUserById = async (id) => {
    return await user_model_1.User.findById(id);
};
const deleteUserFromDB = async (id) => {
    return await user_model_1.User.findByIdAndDelete(id);
};
exports.UserService = {
    getAllUsersFromDB,
    updateProfileInDB,
    findUserById,
    deleteUserFromDB
};
//# sourceMappingURL=user.service.js.map