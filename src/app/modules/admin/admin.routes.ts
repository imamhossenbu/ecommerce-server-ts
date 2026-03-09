import express from 'express';
import * as adminControllers from './admin.controller';
import { protect } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/admin.middleware';

const router = express.Router();

router.get('/stats', protect, isAdmin, adminControllers.getDashboardStats);
router.get('/manage-customers', protect, isAdmin, adminControllers.getManageCustomers);
router.delete("/delete-user/:id", protect, isAdmin, adminControllers.deleteUser);
router.put('/update-settings', protect, isAdmin, adminControllers.updateAdminSettings);
router.patch('/update-profile',protect,isAdmin,adminControllers.updateProfile)

export const adminRoutes = router;