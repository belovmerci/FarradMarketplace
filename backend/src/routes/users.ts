import { Router, Request, Response } from 'express';
import { getDb } from '../db/db';

const router = Router();

// Get all users
router.get('/', (req: Request, res: Response) => {
  const db = getDb()!;
  try {
    const users = db.all('SELECT * FROM Users');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Add a new user
router.post('/', (req: Request, res: Response) => {
  const db = getDb()!;
  const { Username, PasswordHash, Email, Role } = req.body;

  try {
    db.run(
      'INSERT INTO Users (Username, PasswordHash, Email, Role) VALUES (?, ?, ?, ?)',
      [Username, PasswordHash, Email, Role]
    );
    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

export default router;
