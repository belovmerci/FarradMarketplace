import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cartsRouter from './src/routes/carts';
import productsRouter from './src/routes/products';
import usersRouter from './src/routes/users';
import ordersRouter from './src/routes/orders';
import { initDb } from './src/db/db'

const app: Application = express();
const PORT = 3001;

const startServer = async () => {
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
};


initDb();
async () => {
  console.log('Database is ready.');

  // Middleware to parse incoming requests
  app.use(bodyParser.json());

  // Example middleware for debugging (optional)
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

  // Apply route files
  app.use('/api/carts', cartsRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/orders', ordersRouter);

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
