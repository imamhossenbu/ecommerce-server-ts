import { NextFunction, Request, Response } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  console.log('Checking Admin access for:', user?.email);

  if (user && user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, admin only' });
  }
};