import express from 'express';
import * as authControllers from './auth.controller';
import { upload } from '../../config/cloudinary.config'; 
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/register', upload.single('image'), authControllers.registerUser);


router.post('/login', authControllers.loginUser);


router.post('/forget-password', authControllers.forgetPassword);


router.put('/reset-password/:token', authControllers.resetPassword);
router.put('/change-password',protect, authControllers.changePassword);

export const authRoutes = router;