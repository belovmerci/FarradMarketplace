import sqlite3 from 'sqlite3';
import { getDb } from './db';

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
export const getUserByUsername = (userId: string): Promise<any> => {
  const db = getDb()!;
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Users WHERE Username = ?', [userId], (error: any, row: any) => {
      if (error) {
        console.error(`Error fetching user with Username ${userId}:`, error);
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
};

// Create a new user
export const createUser = (username: string, passwordHash: string): Promise<{ userId: number }> => {
  const db = getDb()!;
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
