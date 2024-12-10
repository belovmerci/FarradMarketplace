import { Router, Request, Response, NextFunction } from 'express';
import { getDb } from '../db/db';
import { verifyAccessToken } from '../db/tokens';
import { authenticateTokenNext } from '../middleware/auth';
import jwt from 'jsonwebtoken';

const router = Router();

/*
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

// Middleware to authenticate and extract the user ID
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token is missing.' });
  }

  try {
    const verified = verifyAccessToken(token);
    if (verified && verified.userId) {
      req.body.userId = verified.userId; // Attach userId securely to req.body
      next();
    } else {
      res.status(403).json({ error: 'Invalid or expired token.' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ error: 'Token verification failed.' });
  }
};
*/

// Create a new order and populate OrderItems
router.post('/make-order', (req: Request, res: Response): void => {
  const db = getDb()!;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("401: Order is declined: no token");
    res.status(401).json({ error: 'Access denied. Token is missing.' });
    return;
  }

  console.log("Order is being made");
  const decoded = jwt.decode(token);
  console.log(token);
  console.log('Decoded Token:', decoded);

  // Verify the token
  const verified = verifyAccessToken(token);
    if (!verified)
    {
      console.log("403: Order is declined: unverified:");
      console.log(token);
      res.status(403).json({ error: 'Invalid or expired token.' });
      return;
    }
    else if (!verified.userId) {
      console.log("403: Order is declined: unverified userId:");
      console.log(verified.userId);
      res.status(403).json({ error: 'Invalid or expired token.' });
      return;
    }

  const userId = verified.userId;
  const { shippingAddressId, cart } = req.body;

  // Ensure the cart is not empty
  if (!cart || cart.length === 0) {
    console.log("400: Order is declined: empty cart");
    res.status(400).json({ error: 'Cart cannot be empty.' });
    return;
  }

  // Calculate the total order amount
  const totalAmount = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  // Insert into Orders table
  console.log("inserting into Orders table");
  db.run(
    `INSERT INTO Orders (UserID, ShippingAddressID, OrderDate, TotalAmount, PaymentStatus, OrderStatus) 
     VALUES (?, ?, datetime('now'), ?, ?, ?)`,
    [userId, shippingAddressId, totalAmount, 'Pending', 'Processing']
  )
    .then((orderResult) => {
      const orderId = orderResult.lastID;

      // Populate OrderItems table
      console.log("inserting into OrderItems table");
      const orderItemsPromises = cart.map((item: any) =>
        db.run(
          `INSERT INTO OrderItems (OrderID, ProductID, Quantity, PricePerUnit) VALUES (?, ?, ?, ?)`,
          [orderId, item.id, item.quantity, item.price]
        )
      );

      return Promise.all(orderItemsPromises).then(() => orderId);
    })
    .then((orderId) => {
      console.log("Order created successfully");
      res.status(201).json({ message: 'Order created successfully', orderId });
    })
    .catch((error) => {
      console.log("Error creating order");
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order.' });
    });
});


// Get all orders for a user
router.get('/:userId', (req: Request, res: Response) => {
  const db = getDb()!;
  const userId = req.params.userId;

  try {
    const orders = db.all('SELECT * FROM Orders WHERE UserID = ?', [userId]);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/*
// Create a new order
router.post('/', (req: Request, res: Response) => {
  const db = getDb()!;
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
*/

export default router;
