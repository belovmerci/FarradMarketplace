import { Router, Request, Response } from 'express';
import { getDb } from '../db/db';

const router = Router();

const adminCredentials = {
  username: 'admin',
  password: 'passphrase',
};

let isLoggedIn = false;

// Serve login page
router.get('/', (req: Request, res: Response) => {
  if (isLoggedIn) {
    return res.redirect('/admin/add-product');
  }
  res.send(`
    <html>
      <body>
        <h1>Авторизация администратора</h1>
        <form method="POST" action="/admin/login">
          <label for="username">Логин:</label>
          <input type="text" id="username" name="username" required>
          <br>
          <label for="password">Пароль:</label>
          <input type="password" id="password" name="password" required>
          <br>
          <button type="submit">Авторизоваться</button>
        </form>
      </body>
    </html>
  `);
});

// Handle login
router.post('/login', (req: Request, res: Response) => {
    console.log('Received login data:', req.body);
    const { username, password } = req.body;
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
      isLoggedIn = true;
      console.log('Login successful!');
      res.redirect('/admin/add-product');
    } else {
      console.log('Invalid credentials:', username, password);
      res.status(403).send('Unauthorized: Invalid credentials. <a href="/admin">Try again</a>');
    }
  });


router.get('/add-product', (req: Request, res: Response) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Panel</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f9f9f9;
          }
  
          h2 {
            margin-top: 20px;
          }
  
          .form-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
  
          form {
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
  
          label {
            display: inline-block;
            width: 200px;
            text-align: right;
            padding-right: 10px;
          }
  
          input, select {
            width: calc(100% - 220px);
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
          }
  
          button {
            background-color: #007BFF;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
  
          button:hover {
            background-color: #0056b3;
          }
  
          .message {
            margin-top: 10px;
            padding: 10px;
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            border-radius: 4px;
            display: none;
          }
        </style>
      </head>
      <body>
        <h1>Admin Panel</h1>
        <div class="form-container">
          <form id="product-form">
            <h2>Add Product</h2>
            <label for="name">Name:</label><input type="text" id="name" name="name" />
            <label for="description">Description:</label><input type="text" id="description" name="description" />
            <label for="price">Price:</label><input type="number" id="price" name="price" />
            <label for="stockQuantity">Stock Quantity:</label><input type="number" id="stockQuantity" name="stockQuantity" />
            <label for="categoryId">Category ID:</label><input type="number" id="categoryId" name="categoryId" />
            <button type="button" onclick="submitForm('product-form', '/products')">Add Product</button>
            <div class="message" id="product-form-message">Product added successfully!</div>
          </form>
  
          <form id="category-form">
            <h2>Add Category</h2>
            <label for="categoryName">Category Name:</label><input type="text" id="categoryName" name="categoryName" />
            <button type="button" onclick="submitForm('category-form', '/categories')">Add Category</button>
            <div class="message" id="category-form-message">Category added successfully!</div>
          </form>
        </div>
  
        <script>
          async function submitForm(formId, endpoint) {
            const form = document.getElementById(formId);
            const formData = new FormData(form);
  
            // Convert FormData to JSON object
            const data = Object.fromEntries(formData.entries());
  
            try {
              const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
  
              if (response.ok) {
                // Show success message
                const messageDiv = document.getElementById(\`\${formId}-message\`);
                messageDiv.style.display = 'block';
  
                // Clear the form fields
                form.reset();
  
                // Hide the message after 3 seconds
                setTimeout(() => {
                  messageDiv.style.display = 'none';
                }, 3000);
              } else {
                console.error('Error submitting form:', response.statusText);
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

// Handle product submission
router.post('/add-product', async (req: Request, res: Response) => {
  if (!isLoggedIn) {
    return res.redirect('/admin');
  }
  const db = getDb()!;
  const { name, description, price, stockQuantity, categoryId, imageUrl } = req.body;

  try {
    await db.run(
      `INSERT INTO Products (Name, Description, Price, StockQuantity, CategoryID, ImageURL)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, price, stockQuantity, categoryId, imageUrl || null]
    );
    res.send(`
      <p>Product added successfully!</p>
      <a href="/admin/add-product">Add another product</a>
    `);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Failed to add product. <a href="/admin/add-product">Try again</a>');
  }
});

// Handle category submission
router.post('/add-category', async (req: Request, res: Response) => {
  if (!isLoggedIn) {
    return res.redirect('/admin');
  }
  const db = getDb()!;
  const { categoryName} = req.body;

  try {
    await db.run(
      `INSERT INTO Categories (Name)
       VALUES (?)`,
      [categoryName || null]
    );
    res.send(`
      <p>Category added successfully!</p>
      <a href="/admin/add-category">Add another category</a>
    `);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Failed to add category. <a href="/admin/add-category">Try again</a>');
  }
});

// Logout
router.get('/logout', (req: Request, res: Response) => {
  isLoggedIn = false;
  res.redirect('/admin');
});

export default router;
