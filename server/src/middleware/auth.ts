import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../db/tokens';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  const verified = verifyAccessToken(token);
  if (verified) {
    req.body.userId = verified.userId; // Attach userId to request object for route handling
    next();
  } else {
    res.status(403).json({ error: 'Token is invalid or expired' });
  }
};
