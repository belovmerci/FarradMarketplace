import { Router, Request, Response } from 'express';
import { getDb } from '../db/db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const db = getDb()!;

  let query = 'SELECT * FROM Categories'; 
  try {
    const products = await db.all(query);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a new category
router.post('/', (req: Request, res: Response) => {
  const db = getDb()!;
  const {
    Name
  } = req.body;

  try {
    db.run(
      `INSERT INTO Categories (Name) VALUES (?)`,
      [
        Name
      ]
    );
    res.status(201).json({ message: 'Category added successfully' });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

export default router;
