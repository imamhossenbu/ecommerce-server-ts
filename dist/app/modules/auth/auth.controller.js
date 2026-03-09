"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgetPassword = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const auth_service_1 = require("./auth.service");
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please add all fields" });
        }
        const userExists = await auth_service_1.AuthService.findUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const imageUrl = req.file ? req.file.path : "";
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await auth_service_1.AuthService.createUserInDB({
            name, email, password: hashedPassword, profileImage: imageUrl,
        });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).json({ success: true, message: "User registered successfully", data: { ...userResponse, token } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await auth_service_1.AuthService.findUserByEmail(email);
        if (!user)
            return res.status(400).json({ success: false, message: "Invalid User" });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Wrong Password" });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(200).json({ success: true, message: "Login successfully", data: { ...userResponse, token } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.loginUser = loginUser;
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await auth_service_1.AuthService.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: "No user found in this mail" });
        }
        const resetToken = crypto_1.default.randomBytes(20).toString("hex");
        user.resetPasswordToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
        await user.save();
        const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000";
        const resetUrl = `${frontendBase}/reset-password/${resetToken}`;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        const mailOptions = {
            to: user.email,
            subject: "Password Reset Request - Seoul Mirage",
            html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2>Password Reset</h2>
          <p>নিচের বাটনে ক্লিক করে আপনার পাসওয়ার্ড রিসেট করুন:</p>
          <a href="${resetUrl}" style="background: black; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Reset Password</a>
          <p>এই লিঙ্কটি ৩০ মিনিট কাজ করবে।</p>
        </div>`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Reset link send to your email" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error in send mail" });
    }
};
exports.forgetPassword = forgetPassword;
const resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto_1.default.createHash("sha256").update(req.params.token).digest("hex");
        const user = await auth_service_1.AuthService.findUserByResetToken(hashedToken);
        if (!user) {
            return res.status(400).json({ success: false, message: "Link expired. Please try again" });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ success: true, message: "Password change successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error in server" });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.controller.js.map