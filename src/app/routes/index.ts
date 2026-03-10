import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/user/user.routes';
import { productRoutes } from '../modules/product/product.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { orderRoutes } from '../modules/order/order.routes';
import { reviewRoutes } from '../modules/review/review.routes';
import { uploadRoutes } from '../modules/upload/upload.routes';
import { adminRoutes } from '../modules/admin/admin.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path:'/products',
    route:productRoutes
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path:'/orders',
    route: orderRoutes
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
  {
  path: '/uploads',
  route: uploadRoutes,
},
{
  path: '/admin',
  route: adminRoutes,
},
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;