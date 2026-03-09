import { Request, Response } from 'express';
export declare const createProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProductDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllProducts: (req: Request, res: Response) => Promise<void>;
export declare const deleteProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBestsellers: (req: Request, res: Response) => Promise<void>;
export declare const getNewArrivals: (req: Request, res: Response) => Promise<void>;
export declare const updateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
