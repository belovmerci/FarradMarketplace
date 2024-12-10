import { Router, Request, Response } from 'express';
import { getDb } from '../db/db';
import { generateAccessToken, generateRefreshToken } from '../db/tokens';
import { getUserByUsername } from '../db/users';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  console.log("User attempting login: ");
  console.log(req.body);
  const db = getDb();
  const { username, passwordHash } = req.body;

  try {
    const user = await getUserByUsername(username);
    console.log(user);

    if (user.Username && user.PasswordHash === passwordHash) {
      // user.UserID present in user
      const accessToken = generateAccessToken(user.UserID);
      const refreshToken = generateRefreshToken(user.UserID);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      console.log("200: sending back accesstoken");
      console.log(accessToken);
      res.status(200).json({ accessToken, userId: user.userId });
    } else {
      console.log("401: invalid username or password");
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.log("500: responding error");
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
  console.log("Success /auth/login");
});

/*
// User login
router.post('/login', async (req: Request, res: Response) => {
  console.log("User attempting login: ");
  console.log(req.body);
  const db = getDb();
  const { username, passwordHash } = req.body;

  try {
    const user = await getUserByUsername(username);
    console.log(user);

    if (user.Username && user.PasswordHash === passwordHash) {
      const accessToken = generateAccessToken(user.userId);
      const refreshToken = generateRefreshToken(user.userId);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      console.log("200: sending back accesstoken");
      console.log(accessToken)
      res.status(200).json({ accessToken, userId: user.userId });
    } else {
      console.log("401: invalid username or password");
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.log("500: responding error");
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
  console.log("finished /auth/login");
});
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
    console.log("inserted into db: " + req);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
