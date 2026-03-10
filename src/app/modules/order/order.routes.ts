import express from 'express';
import * as orderControllers from './order.controller';
import { protect } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/admin.middleware';

const router = express.Router();

router.post('/create-checkout-session', orderControllers.createCheckoutSession);
router.post('/payment/success/:tranId', orderControllers.paymentSuccess);
router.post('/payment/fail/:tranId', orderControllers.paymentFail);
router.post('/payment/cancel/:tranId', orderControllers.paymentCancel);

router.get('/my-orders', protect, orderControllers.getMyOrders);
router.get('/all-orders', protect, isAdmin, orderControllers.getAllOrders);
router.patch('/update-order-status/:id', protect, isAdmin, orderControllers.updateOrderStatus);

router.get('/:tranId', protect, orderControllers.getOrderByTransactionId);

export const orderRoutes = router;