import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null; // Store the database connection globally

// Open the SQLite database connection
export const initDb = async () => {
  try {
    const database = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    // Create Users table
    await database.exec(`
      CREATE TABLE IF NOT EXISTS Users (
        UserID INTEGER PRIMARY KEY AUTOINCREMENT,
        Username TEXT NOT NULL,
        PasswordHash TEXT NOT NULL,
        Email TEXT NOT NULL,
        Role TEXT NOT NULL
      );
    `);

    /*
    await database.exec(`
      CREATE TABLE IF NOT EXISTS Products (
        ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Description TEXT,
        Price REAL NOT NULL,
        StockQuantity INTEGER NOT NULL,
        CategoryID INTEGER NOT NULL,
        FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
      );
    `);
    */
    // Create Products table
    await database.exec(`
      CREATE TABLE IF NOT EXISTS Products (
        ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Description TEXT,
        Price REAL NOT NULL,
        StockQuantity INTEGER NOT NULL,
        CategoryID INTEGER NOT NULL,
        ImageURL TEXT,
        ProductType TEXT,
        Brand TEXT,
        FrameSize TEXT,
        WheelSize REAL,
        BrakeType TEXT,
        GearCount INTEGER,
        Weight REAL,
        Material TEXT,
        SuspensionType TEXT,
        Color TEXT,
        ModelYear INTEGER,
        FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
      );
    `);

    // Create Categories table
    await database.exec(`
      CREATE TABLE IF NOT EXISTS Categories (
        CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL
      );
    `);

    // Create Carts table
    await database.exec(`
      CREATE TABLE IF NOT EXISTS Carts (
        CartID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INTEGER NOT NULL,
        ProductID INTEGER NOT NULL,
        Quantity INTEGER NOT NULL,
        FOREIGN KEY (UserID) REFERENCES Users(UserID),
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
      );
    `);

    // Create Orders table
    await database.exec(`
      CREATE TABLE IF NOT EXISTS Orders (
        OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INTEGER NOT NULL,
        ShippingAddressID INTEGER NOT NULL,
        OrderDate TEXT NOT NULL,
        TotalAmount REAL NOT NULL,
        PaymentStatus TEXT NOT NULL,
        OrderStatus TEXT NOT NULL,
        FOREIGN KEY (UserID) REFERENCES Users(UserID),
        FOREIGN KEY (ShippingAddressID) REFERENCES ShippingAddresses(ShippingAddressID)
      );
    `);

    // Create ShippingAddresses table
    await database.exec(`
      CREATE TABLE IF NOT EXISTS ShippingAddresses (
        ShippingAddressID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INTEGER NOT NULL,
        Address TEXT NOT NULL,
        City TEXT NOT NULL,
        Country TEXT NOT NULL,
        PostalCode TEXT NOT NULL,
        PhoneNumber TEXT NOT NULL,
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
      );
    `);

    db = database;
    console.log('Database initialized and tables created successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Getter function to retrieve the active DB connection
export const getDb = (): Database | null => {
  if (!db) {
    throw new Error("Database has not been initialized. Call initDb() first.");
  }
  return db;
};
