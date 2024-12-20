import { Router, Request, Response } from 'express';
import { getDb } from '../db/db';

const router = Router();


// Get cart items by user
router.get('/:userId', (req: Request, res: Response) => {
  const db = getDb()!;
  const userId = req.params.userId;

  try {
    const cartItems = db.all('SELECT * FROM Carts WHERE UserID = ?', [userId]);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Add a product to the cart
router.post('/', async (req: Request, res: Response) => {
  const db = getDb()!;
  const { UserID, ProductId, Quantity } = req.body;

  try {
    const result = await db.run(`INSERT INTO Carts (UserID, ProductID, Quantity) VALUES (?, ?, ?)`, [UserID, ProductId, Quantity]);
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

export default router;
