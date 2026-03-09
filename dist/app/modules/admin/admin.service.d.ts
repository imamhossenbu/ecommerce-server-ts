import { Types } from 'mongoose';
export declare const AdminService: {
    getDashboardStatsFromDB: () => Promise<{
        stats: {
            totalRevenue: number;
            totalOrders: number;
            totalCustomers: number;
            avgOrderValue: number;
        };
        recentOrders: (import("mongoose").Document<unknown, {}, import("../order/order.interface").IOrder, {}, import("mongoose").DefaultSchemaOptions> & import("../order/order.interface").IOrder & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
        topProducts: (import("mongoose").Document<unknown, {}, import("../product/product.interface").IProduct, {}, import("mongoose").DefaultSchemaOptions> & import("../product/product.interface").IProduct & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
        salesData: {
            name: string;
            revenue: any;
        }[];
    }>;
    getManageCustomersFromDB: (query: any) => Promise<{
        customerData: any[];
        totalCustomers: number;
        limit: number;
    }>;
};
