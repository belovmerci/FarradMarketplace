import { Router, Request, Response } from 'express';
import { getDb } from '../db/db';

const router = Router();

// Get all products, with optional filters (by category or ID range)
router.get('/', async (req: Request, res: Response) => {
  const db = getDb()!;
  const { categoryId, minId, maxId } = req.query;  // Extract query parameters

  let query = 'SELECT * FROM Products WHERE 1=1';  // Default query

  const params: (string | number)[] = [];  // Params for prepared statements

  // Filter by CategoryID if provided
  if (categoryId) {
    query += ' AND CategoryID = ?';
    params.push(Number(categoryId));
  }

  // Filter by ProductID range (minId, maxId) if provided
  if (minId || maxId) {
    if (minId) {
      query += ' AND ProductID >= ?';
      params.push(Number(minId));
    }
    if (maxId) {
      query += ' AND ProductID <= ?';
      params.push(Number(maxId));
    }
  }

  try {
    const products = await db.all(query, params);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a new product
router.post('/', (req: Request, res: Response) => {
  const db = getDb()!;
  const {
    Name,
    Description,
    Price,
    StockQuantity,
    CategoryId,
    ImageUrl,
    productType,
    brand,
    frameSize,
    wheelSize,
    brakeType,
    gearCount,
    weight,
    material,
    suspensionType,
    color,
    modelYear
  } = req.body;

  try {
    db.run(
      `INSERT INTO Products (
        CategoryID, Name, Description, Price, StockQuantity, ImageUrl, ProductType, Brand, FrameSize,
        WheelSize, BrakeType, GearCount, Weight, Material, SuspensionType, Color, ModelYear
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Name,
        Description,
        Price,
        StockQuantity,
        CategoryId,
        ImageUrl || null, // Optional field, so it's nullable
        productType || null, // Optional field, so it's nullable
        brand || null, // Optional field, so it's nullable
        frameSize || null, // Optional field, so it's nullable
        wheelSize || null, // Optional field, so it's nullable
        brakeType || null, // Optional field, so it's nullable
        gearCount || null, // Optional field, so it's nullable
        weight || null, // Optional field, so it's nullable
        material || null, // Optional field, so it's nullable
        suspensionType || null, // Optional field, so it's nullable
        color || null, // Optional field, so it's nullable
        modelYear || null // Optional field, so it's nullable
      ]
    );
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

export default router;
