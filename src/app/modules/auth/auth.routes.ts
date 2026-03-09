import express from 'express';
import * as authControllers from './auth.controller';
import { upload } from '../../config/cloudinary.config'; 

const router = express.Router();

router.post('/register', upload.single('image'), authControllers.registerUser);


router.post('/login', authControllers.loginUser);


router.post('/forget-password', authControllers.forgetPassword);


router.put('/reset-password/:token', authControllers.resetPassword);

export const authRoutes = router;