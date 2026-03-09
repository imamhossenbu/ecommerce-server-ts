import { Order } from '../order/order.model';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
import { Types } from 'mongoose';

const getDashboardStatsFromDB = async () => {
  const totalOrders = await Order.countDocuments({ paymentStatus: "Paid" });
  const totalCustomers = await User.countDocuments({ role: "user" });
  const orders = await Order.find({ paymentStatus: "Paid" });
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
  const topProducts = await Product.find().limit(5);

  const rawSalesData = await Order.aggregate([
    { $match: { paymentStatus: "Paid" } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { "_id": 1 } }
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const salesData = monthNames.map((month, index) => {
    const monthNumber = index + 1;
    const foundMonth = rawSalesData.find(item => item._id === monthNumber);
    return { name: month, revenue: foundMonth ? foundMonth.revenue : 0 };
  });

  return { stats: { totalRevenue, totalOrders, totalCustomers, avgOrderValue }, recentOrders, topProducts, salesData };
};

const getManageCustomersFromDB = async (query: any) => {
  const { page = 1, limit = 10, search = "", status = "" } = query;
  const skip = (Number(page) - 1) * Number(limit);

  let filter: any = { role: "user" };
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }
  if (status) filter.status = status;

  const customers = await User.find(filter).select("-password").skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

  const customerData = await Promise.all(customers.map(async (user: any) => {
    const stats = await Order.aggregate([
      { $match: { "customerInfo.email": user.email } },
      { $group: { 
          _id: null, 
          totalOrders: { $sum: 1 }, 
          totalSpent: { $sum: "$totalAmount" },
          lastActive: { $max: "$createdAt" }
      }}
    ]);

    return {
      ...user.toObject(),
      ordersCount: stats[0]?.totalOrders || 0,
      totalSpent: stats[0]?.totalSpent || 0,
      lastActive: stats[0]?.lastActive || user.createdAt
    };
  }));


  const totalCustomers = await User.countDocuments({ role: "user" });
  const newCustomers = await User.countDocuments({ 
    role: "user", 
    createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } 
  });
  const inactiveCustomers = await User.countDocuments({ role: "user", status: "inactive" });
  
  const avgOrderValue = await Order.aggregate([
    { $group: { _id: null, avg: { $avg: "$totalAmount" } } }
  ]);

  return {
    customerData,
    totalCustomers,
    limit: Number(limit),
    stats: {
      totalCustomers,
      newCustomers,
      inactiveCustomers,
      avgOrderValue: avgOrderValue[0]?.avg || 0
    }
  };
};

const updateUserProfileInDB = async (userId: string, updateData: { role?: string; status?: string }) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { 
      new: true,
      runValidators: true 
    }
  );
};



export const AdminService = {
  getDashboardStatsFromDB,
  getManageCustomersFromDB,
  updateUserProfileInDB
};