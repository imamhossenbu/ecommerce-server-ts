import { Request, Response } from 'express';
export declare const createCheckoutSession: (req: Request, res: Response) => Promise<void>;
export declare const paymentSuccess: (req: Request, res: Response) => Promise<void>;
export declare const paymentFail: (req: Request, res: Response) => Promise<void>;
export declare const paymentCancel: (req: Request, res: Response) => Promise<void>;
export declare const getMyOrders: (req: Request, res: Response) => Promise<void>;
export declare const getAllOrders: (req: Request, res: Response) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
