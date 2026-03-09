import { IReview } from './review.interface';
export declare const ReviewService: {
    addReviewInDB: (payload: Partial<IReview>) => Promise<import("mongoose").Document<unknown, {}, IReview, {}, import("mongoose").DefaultSchemaOptions> & IReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getProductReviewsFromDB: (productId: string) => Promise<(import("mongoose").Document<unknown, {}, IReview, {}, import("mongoose").DefaultSchemaOptions> & IReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getHomeReviewsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IReview, {}, import("mongoose").DefaultSchemaOptions> & IReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
};
