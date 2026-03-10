import { Request, Response } from 'express';
import { OrderService } from './order.service';

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { customerInfo, items, totalAmount, shippingFee } = req.body;
    const transactionId = `TXN-${Date.now()}`;
    const finalAmount = parseFloat(totalAmount) + (parseFloat(shippingFee) || 0);

    const paymentData = {
  total_amount: finalAmount,
  currency: 'BDT',
  tran_id: transactionId,
  success_url: `${process.env.BACKEND_URL}/orders/payment/success/${transactionId}`,
  fail_url: `${process.env.BACKEND_URL}/orders/payment/fail/${transactionId}`,
  cancel_url: `${process.env.BACKEND_URL}/orders/payment/cancel/${transactionId}`,
  shipping_method: 'YES',
  product_name: 'Skincare', 
  product_profile: 'general',
  cus_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
  cus_email: customerInfo.email,
  cus_phone: customerInfo.phone,
  cus_add1: customerInfo.address || 'Barisal',
  cus_city: customerInfo.city || 'Barisal',
  cus_postcode: customerInfo.zipCode || '4390', 
  cus_country: 'Bangladesh',
  ship_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
  ship_add1: customerInfo.address || 'Barisal',
  ship_city: customerInfo.city || 'Barisal',
  ship_postcode: customerInfo.zipCode || '4390',
  ship_country: 'Bangladesh',
};

    await OrderService.createOrderInDB({
      customerInfo, items, totalAmount, shippingFee, transactionId, paymentStatus: 'Pending'
    });

    const apiResponse = await OrderService.initPayment(paymentData);
    console.log(apiResponse)
    if (apiResponse?.GatewayPageURL) {
      res.status(200).json({ success: true, url: apiResponse.GatewayPageURL });
    } else {
      res.status(400).json({ success: false, message: "SSLCommerz session failed" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const paymentSuccess = async (req: Request, res: Response) => {
  const { tranId } = req.params;
  await OrderService.updateOrderPaymentStatus(tranId as string, 'Paid');
  res.redirect(`${process.env.FRONTEND_URL}/success`);
};

export const paymentFail = async (req: Request, res: Response) => {
  const { tranId } = req.params;
  await OrderService.deleteOrderByTranId(tranId as string);
  res.redirect(`${process.env.FRONTEND_URL}/cancel`);
};

export const paymentCancel = async (req: Request, res: Response) => {
  const { tranId } = req.params;
  await OrderService.updateOrderPaymentStatus(tranId as string, 'Cancelled');
  res.redirect(`${process.env.FRONTEND_URL}/cancel`);
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getOrdersByEmail((req as any).user.email);
    res.status(200).json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.getAllOrdersFromDB(req.query);
    res.status(200).json({
      success: true,
      totalOrders: result.totalOrders,
      totalPages: Math.ceil(result.totalOrders / result.limit),
      currentPage: result.page,
      stats: result.summary,
      data: result.orders
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.updateOrderStatusInDB(req.params.id as string, req.body.status);
    if (!result) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Status updated", data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getOrderByTransactionId = async (req: Request, res: Response) => {
  try {
    const { tranId } = req.params; 
    const order = await OrderService.getOrderByIdFromDB(tranId as string);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found with this transaction ID" 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: order 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};