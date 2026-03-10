import SSLCommerzPayment from 'sslcommerz-lts';
import { Order } from './order.model';
import { IOrder } from './order.interface';

const store_id = process.env.STORE_ID as string;
const store_passwd = process.env.STORE_PASSWORD as string;
const is_live = false; 

const createOrderInDB = async (orderData: Partial<IOrder>) => {
  return await Order.create(orderData);
};

const initPayment = async (data: any) => {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  return await sslcz.init(data);
};

const updateOrderPaymentStatus = async (tranId: string, status: string) => {
  return await Order.findOneAndUpdate({ transactionId: tranId }, { paymentStatus: status });
};

const deleteOrderByTranId = async (tranId: string) => {
  return await Order.findOneAndDelete({ transactionId: tranId });
};

const getOrdersByEmail = async (email: string) => {
  return await Order.find({ "customerInfo.email": email }).sort({ createdAt: -1 });
};

const getOrderByIdFromDB = async (tranId: string) => {
  return await Order.findOne({transactionId:tranId});
};

const getAllOrdersFromDB = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  let filter: any = {};
  if (query.search) {
    const searchRegex = new RegExp(query.search as string, 'i');
    filter.$or = [
      { transactionId: searchRegex },
      { "customerInfo.firstName": searchRegex },
      { "customerInfo.email": searchRegex }
    ];
  }
  if (query.status) filter.paymentStatus = query.status;
  if (query.orderStatus) filter.orderStatus = query.orderStatus;

  const orders = await Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const totalOrders = await Order.countDocuments(filter);

  // Stats Calculation using Aggregate
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$totalAmount", 0] } },
        totalOrders: { $sum: 1 },
        pendingOrders: { $sum: { $cond: [{ $eq: ["$paymentStatus", "Pending"] }, 1, 0] } }
      }
    }
  ]);

  const summary = stats.length > 0 ? stats[0] : { totalRevenue: 0, totalOrders: 0, pendingOrders: 0 };

  return { orders, totalOrders, page, limit, summary };
};

const updateOrderStatusInDB = async (id: string, status: string) => {
  return await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
};

export const OrderService = {
  createOrderInDB,
  initPayment,
  updateOrderPaymentStatus,
  deleteOrderByTranId,
  getOrdersByEmail,
  getOrderByIdFromDB,
  getAllOrdersFromDB,
  updateOrderStatusInDB
};