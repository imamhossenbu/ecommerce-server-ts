import { IProduct } from './product.interface';
export declare const ProductService: {
    createProductInDB: (productData: Partial<IProduct>) => Promise<import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getProductDetailsFromDB: (id: string) => Promise<{
        product: import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
        totalReviews: number;
        avgRating: number;
    } | null>;
    getAllProductsFromDB: (query: any) => Promise<{
        products: (import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
        totalProducts: number;
        page: number;
        limit: number;
    }>;
    deleteProductFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getBestsellersFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getNewArrivalsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateProductInDB: (id: string, updateData: any) => Promise<(import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
};
