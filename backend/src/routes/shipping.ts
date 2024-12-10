import { Router, Request, Response } from 'express';
import { getDb } from '../db/db';

const router = Router();

// GET: Fetch all shipping addresses
router.get('/', async (req: Request, res: Response) => {
  const db = getDb();
  try {
    console.log("Getting shipping addresses");
    const shippingAddresses = await db!.all(`
      SELECT ShippingAddressID, Name 
      FROM ShippingAddresses
    `);
    res.status(200).json(shippingAddresses);
    console.log("Sending %o", shippingAddresses);
  } catch (error) {
    console.error('Error fetching shipping addresses:', error);
    res.status(500).json({ error: 'Failed to fetch shipping addresses' });
  }
});

router.post('/', async (req: Request, res: Response):Promise<void> => {
  const db = getDb();
  const { Name, Address, City, Country, PostalCode, PhoneNumber } = req.body;

  if (!Name || Name.trim() === '') {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  try {
    const result = await db!.run(
      `
      INSERT INTO ShippingAddresses (Name, Address, City, Country, PostalCode, PhoneNumber)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [Name, Address || null, City || null, Country || null, PostalCode || null, PhoneNumber || null]
    );

    res.status(201).json({ message: 'Shipping address created successfully', id: result.lastID });
  } catch (error) {
    console.error('Error creating shipping address:', error);
    res.status(500).json({ error: 'Failed to create shipping address' });
  }
});

/*
router.post('/', (req: Request, res: Response) => {
  const db = getDb();

  // Extract fields from request body
  const { name, address, city, country, postalCode, phoneNumber } = req.body;

  // Validate required field `name`
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  // Insert into the database using Promises
  db!.run(
    `
    INSERT INTO ShippingAddresses (Name, Address, City, Country, PostalCode, PhoneNumber)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, address || null, city || null, country || null, postalCode || null, phoneNumber || null]
  )
    .then((result: any) => {
      // Respond with success
      res.status(201).json({ message: 'Shipping address created successfully', id: result.lastID });
    })
    .catch((error: any) => {
      console.error('Error creating shipping address:', error);
      res.status(500).json({ error: 'Failed to create shipping address' });
    });
});
*/

export default router;
