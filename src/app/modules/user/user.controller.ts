import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserService } from './user.service';

// Get Logged User
export const getLoggedUser = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ success: true, data: (req as any).user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const updatedUser = await UserService.updateProfileInDB(userId, updateData);

    res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change Password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user._id;

    const user = await UserService.findUserById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password as string);
    if (!isMatch) return res.status(400).json({ success: false, message: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during logout' });
  }
};

// Get All Users (Admin)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 20;
    const searchKey = (req.query.search as string) || "";

    const result = await UserService.getAllUsersFromDB(page, perPage, searchKey);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id  = req.params.id as string;

    const result = await UserService.deleteUserFromDB(id);
    if (!result) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};