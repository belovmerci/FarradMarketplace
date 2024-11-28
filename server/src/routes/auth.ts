import { Router, Request, Response } from 'express';
import { getDb } from '../db/db';
import { generateAccessToken, generateRefreshToken } from '../db/tokens';
import { getUserByUsername } from '../db/users';

const router = Router();

// User login
router.post('/login', async (req: Request, res: Response) => {
  const db = getDb()!;
  const { username, passwordHash } = req.body;

  try {
    const user = await getUserByUsername(username);

    if (user && user.passwordHash === passwordHash) {
      const accessToken = generateAccessToken(user.userId);
      const refreshToken = generateRefreshToken(user.userId);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.status(200).json({ accessToken, userId: user.userId });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});
/*
router.post('/login', async (req: Request, res: Response) => {
  const { username, passwordHash } = req.body;

  try {
    // Await the result of the db.get() call
    const user = await db.get('SELECT * FROM Users WHERE Username = ? AND PasswordHash = ?', [username, passwordHash]);

    // Check if the user exists
    if (user) {
      res.status(200).json({ message: 'Login successful', userId: user.UserID });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});
*/

// User registration
router.post('/register', async (req: Request, res: Response) => {
  const db = getDb()!;
  const { username, passwordHash, email, role } = req.body;

  try {
    db.run('INSERT INTO Users (Username, PasswordHash, Email, Role) VALUES (?, ?, ?, ?)', [username, passwordHash, email, role]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
