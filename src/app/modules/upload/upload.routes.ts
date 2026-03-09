import express from 'express';
import * as uploadControllers from './upload.controller';
import { upload } from '../../config/cloudinary.config';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();


router.post(
  "/upload-single", 
  protect, 
  upload.single("image"), 
  uploadControllers.uploadImage
);


router.post(
  "/upload-multiple", 
  protect, 
  upload.array("images", 10), 
  uploadControllers.uploadMultipleImages
);

export const uploadRoutes = router;