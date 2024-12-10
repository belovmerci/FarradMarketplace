import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cartsRouter from './routes/carts';
import productsRouter from './routes/products';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import ordersRouter from './routes/orders';
import categoriesRouter from './routes/categories';
import shippingRouter from './routes/shipping';
import adminRouter from './routes/admin';

import { initDb } from './db/db'
import cors from 'cors';
import typescript from 'typescript';
import cookieParser from 'cookie-parser';

const app: Application = express();
const PORT = 3001;
app.use(express.static('public'));

app.use(bodyParser.json());
// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// Parse JSON data
app.use(express.json());

// Use Cors
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
);

// Apply route files
app.use('/carts', cartsRouter);
app.use('/admin', adminRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/orders', ordersRouter);
app.use('/categories', categoriesRouter);
app.use('/shipping', shippingRouter);

// Example middleware for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Default route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the API!');
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


(async () => {
  try {
    // Initialize the database
    await initDb();
    console.log('Database initialized.');

    // Start your server only after the database is ready
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1); // Exit the process if DB initialization fails
  }
})()

export default app;

