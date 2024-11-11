import { Router, Request, Response, NextFunction } from 'express';
import { getDb } from '../db/db';
import { verifyAccessToken } from '../db/tokens';

const router = Router();
const db = getDb()!;

// Get all orders for a user
router.get('/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const orders = db.all('SELECT * FROM Orders WHERE UserID = ?', [userId]);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
router.post('/', (req: Request, res: Response) => {
  const { userId, shippingAddressId, totalAmount, paymentStatus, orderStatus } = req.body;

  try {
    db.run(
      `INSERT INTO Orders (UserID, ShippingAddressID, OrderDate, TotalAmount, PaymentStatus, OrderStatus) 
      VALUES (?, ?, datetime('now'), ?, ?, ?)`,
      [userId, shippingAddressId, totalAmount, paymentStatus, orderStatus]
    );
    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Authenticate token
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

export default router;
