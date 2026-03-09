import { IReview } from './review.interface';
export declare const Review: import("mongoose").Model<IReview, {}, {}, {}, import("mongoose").Document<unknown, {}, IReview, {}, import("mongoose").DefaultSchemaOptions> & IReview & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IReview>;
