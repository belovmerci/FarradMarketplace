import sqlite3 from 'sqlite3';
import { getDb } from './db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

// Secret for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const TOKEN_EXPIRATION = '1h'; // Example: 1 hour expiration

// Login Handler
export const authenticateUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Retrieve user from the database
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
    });

    return res.status(200).json({ message: 'Authenticated successfully', token });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch all users
export const getAllUsers = (): Promise<any[]> => {
  const db = getDb()!;
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Users', (error: any, rows: any[]) => {
      if (error) {
        console.error('Error fetching users:', error);
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
};

// Fetch a specific user by ID
export const getUserById = (userId: string): Promise<any> => {
  const db = getDb()!;
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Users WHERE UserID = ?', [userId], (error: any, row: any) => {
      if (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
};

// Fetch a specific user by name
export const getUserByUsername2 = (userId: string): Promise<any> => {
  const db = getDb()!;
  return new Promise((resolve, reject) => {
    console.log("fetching user by username")
    db.get('SELECT * FROM Users WHERE Username = ?', [userId], (error: any, row: any) => {
      if (error) {
        console.log(`Error fetching user with Username ${userId}:`, error);
        console.error(`Error fetching user with Username ${userId}:`, error);
        reject(error);
      } else {
        console.log("returned " + row)
        resolve(row);
      }
    });
  });
};
export const getUserByUsername = async (username: string) => {
  const db = getDb()!;
    console.log("fetching user by username")
   return await db.get('SELECT * FROM Users WHERE Username = ?', username);
};
/*
export const getUserByUsername = async (username: string) => {
  const db = getDb()!;
  return db.get('SELECT * FROM Users WHERE Username = ?', [username]);
};
*/

// Create a new user
export const createUser = (username: string, passwordHash: string): Promise<{ userId: number }> => {
  const db = getDb()!;
  console.log("running createUser users.ts ?");
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO Users (Username, PasswordHash) VALUES (?, ?)',
      [username, passwordHash],
      function (this: sqlite3.RunResult, error: Error | null) {  // Define the context type here
        if (error) {
          console.error('Error creating user:', error);
          reject(error);
        } else {
          resolve({ userId: this.lastID });  // Now `this.lastID` is recognized
        }
      }
    );
  });
};

// Update a user by ID
export const updateUser = (userId: string, username: string, passwordHash: string): Promise<void> => {
  const db = getDb()!;
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE Users SET Username = ?, PasswordHash = ? WHERE UserID = ?',
      [username, passwordHash, userId],
      (error: any) => {
        if (error) {
          console.error(`Error updating user with ID ${userId}:`, error);
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
};

// Delete a user by ID
export const deleteUser = (userId: string): Promise<void> => {
  const db = getDb()!;
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM Users WHERE UserID = ?', [userId], (error: any) => {
      if (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
