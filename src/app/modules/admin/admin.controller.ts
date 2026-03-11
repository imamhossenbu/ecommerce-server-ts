import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { User } from '../user/user.model';
import bcrypt from 'bcryptjs';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

export const getDashboardStats = catchAsync (async (req: Request, res: Response) => {
  try {
    const data = await AdminService.getDashboardStatsFromDB();
    sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products fetched successfully!',
    data: data,
  });
  } catch (error: any) {
    sendResponse(res,{
      statusCode:500,
      success: false,
      message: error.message
    })
  }
});

export const getManageCustomers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getManageCustomersFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Members data and platform stats fetched successfully!',
    data: {
      
      customers: result.customerData, 
      
      meta: {
        totalCustomers: result.totalCount, 
        totalPages: Math.ceil(result.totalCount / result.limit),
        currentPage: Number(req.query.page) || 1,
        limit: result.limit
      },

      stats: result.stats
    }
  });
});


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if ((req as any).user._id.toString() === id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own admin account!" });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "Customer deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminSettings = async (req: Request, res: Response) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        const adminId = (req as any).user._id; 

        const admin = await User.findById(adminId);
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

        const updateData: any = {};
        if (email) updateData.email = email.toLowerCase();

        if (newPassword) {
            if (!currentPassword) return res.status(400).json({ success: false, message: "Current password is required" });
            const isMatch = await bcrypt.compare(currentPassword, admin.password as string);
            if (!isMatch) return res.status(400).json({ success: false, message: "Current password is incorrect" });
            
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }

        const updatedAdmin = await User.findByIdAndUpdate(adminId, { $set: updateData }, { new: true });
        res.status(200).json({ success: true, message: "Settings updated", data: { email: updatedAdmin?.email } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId, role, status } = req.body;

  const updateData: any = {};
  if (role) updateData.role = role.toLowerCase();
  if (status) updateData.status = status.toLowerCase();

  const result = await AdminService.updateUserProfileInDB(userId, updateData);

  if (!result) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile updated successfully!",
    data: result,
  });
});