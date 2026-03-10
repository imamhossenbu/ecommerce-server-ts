import express from 'express';
import * as userControllers from './user.controller';
import { protect } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/admin.middleware';
import { upload } from '../../config/cloudinary.config';

const router = express.Router();


router.get('/me', protect, userControllers.getLoggedUser);


router.patch('/update-profile', protect, upload.single('image'), userControllers.updateProfile);


router.post('/change-password', protect, userControllers.changePassword);


router.post('/logout', protect, userControllers.logout);




router.get('/all-users', protect, isAdmin, userControllers.getAllUsers);


router.delete('/:id', protect, isAdmin, userControllers.deleteUser);

export const userRoutes = router;