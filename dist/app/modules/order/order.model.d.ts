import { IOrder } from './order.interface';
export declare const Order: import("mongoose").Model<IOrder, {}, {}, {}, import("mongoose").Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IOrder>;
