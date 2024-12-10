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
        <head>
          <link rel="stylesheet" href="/css/admin-dashboard.css">
        </head>
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
    res.status(403).send('Неверные данные пользователя. <a href="/admin">Try again</a>');
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
    const orderItems = await db.all(`SELECT * FROM OrderItems LIMIT ?`, [limit]);
  
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard</title>
        <link rel="stylesheet" type="text/css" href="/css/admin-dashboard.css">
        <script>
        // Function to handle form submission
        async function submitForm(formId, endpoint) {
          const form = document.getElementById(formId);
          const formData = new FormData(form);
          
          const data = {};
          formData.forEach((value, key) => {
            data[key] = value;
          });

          try {
            // Sending data to the server using the fetch API
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            // Handle response
            if (response.ok) {
              const result = await response.json();
              alert('Item added successfully!');
              // You could also update the UI with the new data here
              console.log(result);
            } else {
              alert('Failed to add item.');
            }
          } catch (error) {
            alert('An error occurred.');
            console.error(error);
          }
        }
      </script>
      </head>
      <body>
        <h1>Admin Dashboard</h1>
        <div class="container">
          ${renderFormSection('Products', products, ['Name', 'ImageURL', 'Price', 'StockQuantity', 'CategoryID', 'Description'], '/products', true)} <!-- Products section is wide -->
          ${renderFormSection('Users', users, ['Username', 'PasswordHash', 'Email', 'Role'], '/users')}
          ${renderFormSection('Categories', categories, ['Name'], '/categories')}
          ${renderFormSection('Carts', carts, ['UserID', 'ProductID', 'Quantity'], '/carts')}
          ${renderFormSection('ShippingAddresses', shippingAddresses, ['Name', 'Address', 'City', 'Country', 'PostalCode', 'PhoneNumber'], '/shipping')}
          ${renderFormSection('Orders', orders, ['UserID', 'ShippingAddressID', 'OrderDate', 'TotalAmount', 'PaymentStatus', 'OrderStatus'], '/orders')}
          ${renderFormSection('OrderItems', orderItems, ['OrderID', 'ProductID', 'Quantity'], '/order-items')} <!-- New OrderItems section -->
        </div>
      </body>
      </html>
    `);
  });

  
  // Helper function to render form sections
  function renderFormSection(
    title: string,
    rows: any[],
    fields: string[],
    endpoint: string,
    isWide = false  // New parameter to indicate if the section is wide
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
  
    // Determine class for layout
    const sectionClass = isWide ? 'form-section wide' : 'form-section';
  
    // Render full section
    return `
      <div class="${sectionClass}">
        <h2>${title}</h2>
        ${dataDisplay}
        <form id="${formId}" onsubmit="event.preventDefault(); submitForm('${formId}', '${endpoint}');">
          ${formFields}
          <button type="submit">Add ${title}</button>
        </form>
      </div>
    `;
  }

  router.post('/execute-query', async (req: Request, res: Response):Promise<void> => {
    const db = getDb();
    const { query } = req.body;
  
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Invalid query' });
    }
  
    try {
      // Execute the query
      const result = await db!.all(query);
  
      // Return results
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, error: error });
    }
  });

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
