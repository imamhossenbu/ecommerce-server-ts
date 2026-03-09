import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { AuthService } from './auth.service';

// Register User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please add all fields" });
    }

    const userExists = await AuthService.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const imageUrl = req.file ? req.file.path : "";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await AuthService.createUserInDB({
      name, email, password: hashedPassword, profileImage: imageUrl,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    res.status(201).json({ success: true, message: "User registered successfully", data: { ...userResponse, token } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.findUserByEmail(email);

    if (!user) return res.status(400).json({ success: false, message: "Invalid User" });

    const isMatch = await bcrypt.compare(password as string, user.password as string);
    if (!isMatch) return res.status(400).json({ success: false, message: "Wrong Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    res.status(200).json({ success: true, message: "Login successfully", data: { ...userResponse, token } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Forget Password
export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await AuthService.findUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "No user found in this mail" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; 

    await user.save(); 

    const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendBase}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
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
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in send mail" });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token as string).digest("hex");
    const user = await AuthService.findUserByResetToken(hashedToken) as any;

    if (!user) {
      return res.status(400).json({ success: false, message: "Link expired. Please try again" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ success: true, message: "Password change successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in server" });
  }
};