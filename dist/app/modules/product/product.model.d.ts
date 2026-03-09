import { IProduct } from './product.interface';
export declare const Product: import("mongoose").Model<IProduct, {}, {}, {}, import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IProduct>;
