import { Router, Request, Response } from 'express';
import { getDb } from '../db/db';

const router = Router();
const db = getDb()!;

// Get all products
router.get('/', (req: Request, res: Response) => {
  try {
    const products = db.all('SELECT * FROM Products');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a new product
router.post('/', (req: Request, res: Response) => {
  const { name, description, price, stockQuantity, categoryId } = req.body;

  try {
    db.run(
      'INSERT INTO Products (Name, Description, Price, StockQuantity, CategoryID) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stockQuantity, categoryId]
    );
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

export default router;
