import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../modules/user/user.model';


interface JwtPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('Token detected in Header:', token ? 'Yes' : 'No');

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, please login' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    (req as any).user = user;

    next();
  } catch (error: any) {
    console.error('JWT Error:', error.message);
    return res.status(401).json({ message: 'Token is not valid or expired' });
  }
};