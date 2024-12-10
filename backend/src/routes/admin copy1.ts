import { Router, Request, Response } from 'express';
import { getDb } from '../db/db';

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

// Admin dashboard
router.get('/dashboard', (req: Request, res: Response) => {
  if (!isLoggedIn) {
    return res.redirect('/admin');
  }
  res.send(`
    <html>
      <body>
        <h1>Admin Dashboard</h1>
        <h2>Add Data</h2>
        <form method="POST" action="/admin/users">
          <h3>Add User</h3>
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="passwordHash" placeholder="Password Hash" required>
          <input type="email" name="email" placeholder="Email" required>
          <input type="text" name="role" placeholder="Role" required>
          <button type="submit">Add User</button>
        </form>
        <form method="POST" action="/admin/categories">
          <h3>Add Category</h3>
          <input type="text" name="name" placeholder="Category Name" required>
          <button type="submit">Add Category</button>
        </form>
        <form method="POST" action="/admin/products">
          <h3>Add Product</h3>
          <input type="text" name="name" placeholder="Product Name" required>
          <textarea name="description" placeholder="Description"></textarea>
          <input type="number" name="price" placeholder="Price" required>
          <input type="number" name="stockQuantity" placeholder="Stock Quantity" required>
          <input type="number" name="categoryId" placeholder="Category ID" required>
          <input type="text" name="imageUrl" placeholder="Image URL">
          <input type="text" name="productType" placeholder="Product Type">
          <input type="text" name="brand" placeholder="Brand">
          <input type="text" name="frameSize" placeholder="Frame Size">
          <input type="number" name="wheelSize" placeholder="Wheel Size">
          <input type="text" name="brakeType" placeholder="Brake Type">
          <input type="number" name="gearCount" placeholder="Gear Count">
          <input type="number" name="weight" placeholder="Weight">
          <input type="text" name="material" placeholder="Material">
          <input type="text" name="suspensionType" placeholder="Suspension Type">
          <input type="color" name="color" placeholder="Color">
          <input type="number" name="modelYear" placeholder="Model Year">
          <button type="submit">Add Product</button>
        </form>
        <form method="POST" action="/admin/shipping-addresses">
          <h3>Add Shipping Address</h3>
          <input type="number" name="userId" placeholder="User ID" required>
          <input type="text" name="address" placeholder="Address" required>
          <input type="text" name="city" placeholder="City" required>
          <input type="text" name="country" placeholder="Country" required>
          <input type="text" name="postalCode" placeholder="Postal Code" required>
          <input type="text" name="phoneNumber" placeholder="Phone Number" required>
          <button type="submit">Add Address</button>
        </form>
        <form method="POST" action="/admin/orders">
          <h3>Add Order</h3>
          <input type="number" name="userId" placeholder="User ID" required>
          <input type="number" name="shippingAddressId" placeholder="Shipping Address ID" required>
          <input type="date" name="orderDate" placeholder="Order Date" required>
          <input type="number" name="totalAmount" placeholder="Total Amount" required>
          <input type="text" name="paymentStatus" placeholder="Payment Status" required>
          <input type="text" name="orderStatus" placeholder="Order Status" required>
          <button type="submit">Add Order</button>
        </form>
        <a href="/admin/logout">Logout</a>
  
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

// POST endpoints for each table
router.post('/users', async (req: Request, res: Response) => {
  const { username, passwordHash, email, role } = req.body;
  try {
    await getDb()!.run(
      'INSERT INTO Users (Username, PasswordHash, Email, Role) VALUES (?, ?, ?, ?)',
      [username, passwordHash, email, role]
    );
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.status(500).send('Error adding user');
  }
});

router.post('/categories', async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    await getDb()!.run('INSERT INTO Categories (Name) VALUES (?)', [name]);
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.status(500).send('Error adding category');
  }
});

router.post('/products', async (req: Request, res: Response) => {
    const {
      name, description, price, stockQuantity, categoryId, imageUrl, productType, brand, frameSize,
      wheelSize, brakeType, gearCount, weight, material, suspensionType, color, modelYear
    } = req.body;
  
    try {
      await getDb()!.run(
        `INSERT INTO Products (
          Name, Description, Price, StockQuantity, CategoryID, ImageURL, ProductType, Brand,
          FrameSize, WheelSize, BrakeType, GearCount, Weight, Material, SuspensionType, Color, ModelYear
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, description, price, stockQuantity, categoryId, imageUrl, productType, brand, frameSize,
          wheelSize, brakeType, gearCount, weight, material, suspensionType, color, modelYear]
      );
      res.redirect('/admin/dashboard');
    } catch (error) {
      res.status(500).send('Error adding product');
    }
  });

  router.post('/carts', async (req: Request, res: Response) => {
    const { userId, productId, quantity } = req.body;
  
    try {
      await getDb()!.run(
        `INSERT INTO Carts (UserID, ProductID, Quantity) VALUES (?, ?, ?)`,
        [userId, productId, quantity]
      );
      res.redirect('/admin/dashboard');
    } catch (error) {
      res.status(500).send('Error adding to cart');
    }
  });

  router.post('/shipping-addresses', async (req: Request, res: Response) => {
    const { userId, address, city, country, postalCode, phoneNumber } = req.body;
  
    try {
      await getDb()!.run(
        `INSERT INTO ShippingAddresses (UserID, Address, City, Country, PostalCode, PhoneNumber) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, address, city, country, postalCode, phoneNumber]
      );
      res.redirect('/admin/dashboard');
    } catch (error) {
      res.status(500).send('Error adding shipping address');
    }
  });

  router.post('/orders', async (req: Request, res: Response) => {
    const { userId, shippingAddressId, orderDate, totalAmount, paymentStatus, orderStatus } = req.body;
  
    try {
      await getDb()!.run(
        `INSERT INTO Orders (UserID, ShippingAddressID, OrderDate, TotalAmount, PaymentStatus, OrderStatus)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, shippingAddressId, orderDate, totalAmount, paymentStatus, orderStatus]
      );
      res.redirect('/admin/dashboard');
    } catch (error) {
      res.status(500).send('Error adding order');
    }
  });

export default router;
