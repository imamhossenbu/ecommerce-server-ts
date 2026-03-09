import express from 'express';
import * as categoryControllers from './category.controller';
import { upload } from '../../config/cloudinary.config';
import { protect } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/admin.middleware';

const router = express.Router();

router.post(
  "/create-category",
  protect,
  isAdmin,
  upload.single("image"),
  categoryControllers.createCategory
);

router.get("/", categoryControllers.getAllCategories);

router.put(
  "/:id",
  protect,
  isAdmin,
  upload.single("image"),
  categoryControllers.updateCategory
);

router.delete(
  "/:id", 
  protect, 
  isAdmin, 
  categoryControllers.deleteCategory
);

export const categoryRoutes = router;