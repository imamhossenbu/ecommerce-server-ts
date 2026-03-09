import express from 'express';
import * as productControllers from './product.controller';
import { upload } from '../../config/cloudinary.config';
import { protect } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/admin.middleware';

const router = express.Router();

const productUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 }, 
  { name: "images", maxCount: 10 }, 
]);

router.post("/create-product", protect, isAdmin, productUpload, productControllers.createProduct);
router.get("/", productControllers.getAllProducts);
router.get("/bestsellers", productControllers.getBestsellers);
router.get("/new-arrivals", productControllers.getNewArrivals);
router.get("/:id", productControllers.getProductDetails);
router.put("/:id", protect, isAdmin, productUpload, productControllers.updateProduct);
router.delete("/:id", protect, isAdmin, productControllers.deleteProduct);

export const productRoutes = router;