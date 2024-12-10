import { Router, Request, Response } from 'express';
import { getDb } from '../db/db';

const router = Router();

// Get all shipping addresses
router.get('/:userId', (req: Request, res: Response) => {
  const db = getDb()!;
  const userId = req.params.userId;

  try {
    const addresses = db.all('SELECT * FROM ShippingAddresses WHERE UserID = ?', [userId]);
    res.status(200).json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// Add a shipping address
router.post('/', (req: Request, res: Response) => {
  const db = getDb()!;
  const { userId, address, city, country, postalCode, phoneNumber } = req.body;

  try {
    db.run(
      'INSERT INTO ShippingAddresses (UserID, Address, City, Country, PostalCode, PhoneNumber) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, address, city, country, postalCode, phoneNumber]
    );
    res.status(201).json({ message: 'Shipping address added successfully' });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Failed to add address' });
  }
});

export default router;
