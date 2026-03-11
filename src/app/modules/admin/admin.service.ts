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
  const { page = 1, limit = 10, search = "", status = "", role = "" } = query;
  const skip = (Number(page) - 1) * Number(limit);

  let filter: any = {};
  
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }
  

  if (status) filter.status = status;
  if (role) filter.role = role; 

  const customers = await User.find(filter)
    .select("-password")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const customerData = await Promise.all(customers.map(async (user: any) => {
    const orderStats = await Order.aggregate([
      { $match: { "customerInfo.email": user.email } },
      { $group: { 
          _id: null, 
          totalOrders: { $sum: 1 }, 
          totalSpent: { $sum: "$totalAmount" }
      }}
    ]);

    return {
      ...user.toObject(),
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalSpent: orderStats[0]?.totalSpent || 0
    };
  }));

  const totalMembers = await User.countDocuments(); 
  const totalAdmins = await User.countDocuments({ role: "admin" });
  const totalUsers = await User.countDocuments({ role: "user" });
  
  const inactiveCount = await User.countDocuments({ status: "inactive" });

  return {
    customerData,
    totalCount: await User.countDocuments(filter), 
    limit: Number(limit),
    stats: {
      totalMembers,
      totalAdmins,
      totalUsers,
      inactiveCount,
      avgOrderValue: (await Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, avg: { $avg: "$totalAmount" } } }
      ]))[0]?.avg || 0
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