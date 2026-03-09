import { Request, Response } from 'express';
export declare const getDashboardStats: (req: Request, res: Response) => Promise<void>;
export declare const getManageCustomers: (req: Request, res: Response) => Promise<void>;
export declare const deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateAdminSettings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
