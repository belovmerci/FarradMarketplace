import { Router, Request, Response } from 'express';
import { getDb } from '../db/db';
import { SHA256 } from 'crypto-js';

const router = Router();

const adminCredentials = {
  username: 'admin',
  password: 'passphrase',
};

let isLoggedIn = false;

// Admin login page
router.get('/', (req: Request, res: Response) => {
    if (isLoggedIn) {
      return res.redirect('/admin/dashboard');
    }
    res.send(`
      <html>
        <body>
          <h1>Admin Login</h1>
          <form method="POST" action="/admin/login">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <br>
            <button type="submit">Login</button>
          </form>
        </body>
      </html>
    `);
  });

  
// Handle login
router.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === adminCredentials.username && password === adminCredentials.password) {
      isLoggedIn = true;
      return res.redirect('/admin/dashboard');
    }
    res.status(403).send('Invalid credentials. <a href="/admin">Try again</a>');
  });
  

router.get('/dashboard', async (req: Request, res: Response) => {
    if (!isLoggedIn) {
      return res.redirect('/admin');
    }
  
    const db = getDb()!;
    const limit = 1000;
  
    // Fetch table data
    const users = await db.all(`SELECT * FROM Users LIMIT ?`, [limit]);
    const products = await db.all(`SELECT * FROM Products LIMIT ?`, [limit]);
    const categories = await db.all(`SELECT * FROM Categories LIMIT ?`, [limit]);
    const carts = await db.all(`SELECT * FROM Carts LIMIT ?`, [limit]);
    const shippingAddresses = await db.all(`SELECT * FROM ShippingAddresses LIMIT ?`, [limit]);
    const orders = await db.all(`SELECT * FROM Orders LIMIT ?`, [limit]);
  
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f9f9f9;
          }
          h1 {
            text-align: center;
          }
          .container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
          }
          .form-section {
            flex: 1;
            min-width: 300px;
            max-width: 600px;
            padding: 10px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
          }
          .form-section h2 {
            margin-bottom: 10px;
          }
          form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          label {
            font-weight: bold;
          }
          input, select {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 100%;
          }
          button {
            background-color: #007BFF;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background-color: #0056b3;
          }
          .data-display {
            max-height: 400px;
            overflow-y: auto;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            padding: 10px;
            background-color: #f1f1f1;
            font-size: 0.9em;
          }
          .data-display table {
            width: 100%;
            border-collapse: collapse;
          }
          .data-display th, .data-display td {
            border: 1px solid #ccc;
            padding: 5px;
            text-align: left;
          }
          .data-display th {
            background-color: #007BFF;
            color: white;
          }
          @media (max-width: 800px) {
            .container {
              flex-direction: column;
            }
          }
        </style>
      </head>
      <body>
        <h1>Admin Dashboard</h1>
        ${renderFormSection('Products', products, ['Name', 'Description', 'Price', 'StockQuantity', 'CategoryID', 'ImageURL'], '/products')}
        <div class="container">
          ${renderFormSection('Users', users, ['Username', 'PasswordHash', 'Email', 'Role'], '/users')}
          <form method="POST" action="/admin/users">
            <h3>Temp real Add User (no SHA256 encryption to the left)</h3>
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="passwordHash" placeholder="Password Hash" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="text" name="role" placeholder="Role" required>
            <button type="submit">Add User</button>
          </form>

          ${renderFormSection('Categories', categories, ['Name'], '/categories')}
          ${renderFormSection('Carts', carts, ['UserID', 'ProductID', 'Quantity'], '/carts')}
          ${renderFormSection('ShippingAddresses', shippingAddresses, ['UserID', 'Address', 'City', 'Country', 'PostalCode', 'PhoneNumber'], '/shipping-addresses')}
          ${renderFormSection('Orders', orders, ['UserID', 'ShippingAddressID', 'OrderDate', 'TotalAmount', 'PaymentStatus', 'OrderStatus'], '/orders')}
        </div>
        <script>
          async function submitForm(formId, endpoint) {
            try {
              const form = document.getElementById(formId);
              const formData = new FormData(form);
              const data = Object.fromEntries(formData.entries());
              const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
  
              if (response.ok) {
                alert('Entry added successfully!');
                form.reset();
              } else {
                alert('Error adding entry.');
              }
            } catch (error) {
              console.error('Error:', error);
            }
          }
        </script>
      </body>
      </html>
    `);
  });
  
  // Helper function to render form sections
  function renderFormSection(
    title: string,
    rows: any[],
    fields: string[],
    endpoint: string
  ): string {
    const formId = `${title.toLowerCase()}-form`;
  
    // Generate data display
    const dataDisplay = `
      <div class="data-display">
        <table>
          <thead>
            <tr>${fields.map((field) => `<th>${field}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${
              rows.length > 0
                ? rows
                    .map(
                      (row) =>
                        `<tr>${fields
                          .map((field) => `<td>${row[field] || ''}</td>`)
                          .join('')}</tr>`
                    )
                    .join('')
                : `<tr><td colspan="${fields.length}">No data available</td></tr>`
            }
          </tbody>
        </table>
      </div>
    `;
  
    // Generate form fields
    const formFields = fields
      .map(
        (field) => `
        <label for="${field}">${field}:</label>
        <input type="text" id="${field}" name="${field}" required />
      `
      )
      .join('');
  
    // Render full section
    return `
      <div class="form-section">
        <h2>${title}</h2>
        ${dataDisplay}
        <form id="${formId}" onsubmit="event.preventDefault(); submitForm('${formId}', '${endpoint}');">
          ${formFields}
          <button type="submit">Add ${title}</button>
        </form>
      </div>
    `;
  }

  router.post('/users', async (req: Request, res: Response) => {
    const { username, password, email, role } = req.body;
    try {
      await getDb()!.run(
        'INSERT INTO Users (Username, PasswordHash, Email, Role) VALUES (?, ?, ?, ?)',
        [username, SHA256(password).toString(), email, role]
      );
      res.redirect('/admin/dashboard');
    } catch (error) {
      res.status(500).send('Error adding user');
      console.log(error);
    }
  });

  export default router;
