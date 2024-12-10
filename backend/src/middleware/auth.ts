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

export const authenticateTokenNext = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied. Token is missing.' });
    return; // Ensure no further execution
  }

  try {
    const verified = verifyAccessToken(token);
    if (verified && verified.userId) {
      req.body.userId = verified.userId; // Attach userId to the request object
      next(); // Pass control to the next middleware/handler
    } else {
      res.status(403).json({ error: 'Invalid or expired token.' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ error: 'Token verification failed.' });
  }
};