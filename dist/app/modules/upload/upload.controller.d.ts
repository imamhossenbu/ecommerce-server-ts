import { Request, Response } from 'express';
export declare const uploadImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadMultipleImages: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
