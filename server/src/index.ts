import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cartsRouter from './routes/carts';
import productsRouter from './routes/products';
import usersRouter from './routes/users';
import ordersRouter from './routes/orders'; // Assuming this will be fixed later

const app: Application = express();
const PORT = 3000;

// Middleware to parse incoming requests
app.use(bodyParser.json());

// Example middleware for debugging (optional)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Apply route files
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);

// Default route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the API!');
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
