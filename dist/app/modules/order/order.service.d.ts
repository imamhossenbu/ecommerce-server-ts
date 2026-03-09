import { IOrder } from './order.interface';
export declare const OrderService: {
    createOrderInDB: (orderData: Partial<IOrder>) => Promise<import("mongoose").Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    initPayment: (data: any) => Promise<any>;
    updateOrderPaymentStatus: (tranId: string, status: string) => Promise<(import("mongoose").Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteOrderByTranId: (tranId: string) => Promise<(import("mongoose").Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getOrdersByEmail: (email: string) => Promise<(import("mongoose").Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getOrderByIdFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getAllOrdersFromDB: (query: any) => Promise<{
        orders: (import("mongoose").Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
        totalOrders: number;
        page: number;
        limit: number;
        summary: any;
    }>;
    updateOrderStatusInDB: (id: string, status: string) => Promise<(import("mongoose").Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
};
