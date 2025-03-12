import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest, JwtPayload } from '../types.js';

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.sendStatus(401);
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      res.sendStatus(401);
      return;
    }

    (req as AuthRequest).user = decoded as JwtPayload;

    next();
  } catch (error) {
    console.error('Error in authMiddleware', error);
    res.sendStatus(401);
    return;
  }
};

export default authMiddleware;
