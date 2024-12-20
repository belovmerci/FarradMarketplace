FarradMarketplace 🚴‍♂️

FarradMarketplace is a specialized e-commerce platform focused on selling bicycles and related products. It provides users with detailed statistics and descriptions of bicycles, along with support for managing shopping carts, authentication, and more. The project is designed with a modern stack featuring TypeScript, React, Express, and SQLite.
Features

    User Authentication:
        Secure login and registration.
        JWT-based token management.
        Role-based access for admin and regular users.

    Product Management:
        View a catalog of bicycles with detailed specifications.
        Categorization of products for easy filtering.

    Shopping Cart:
        Add, update, and remove items.
        View cart summaries.

    Order Management:
        Place orders with shipping address and payment status.
        Admin functionalities for updating order statuses.

    Payment Integration:
        (Currently simulated; ready for Stripe integration in the future).

Tech Stack

    Frontend:
        React (with Context API for state management).
        TypeScript.
        Styled with CSS modules.

    Backend:
        Node.js with Express.
        SQLite database with structured schema for products, users, and orders.
        RESTful API with role-based access control.

Installation and Setup
Prerequisites

    Node.js (v16+ recommended)
    npm or yarn
    Git

Steps to Run the Project

    Clone the Repository:

git clone https://github.com/your-username/FarradMarketplace.git
cd FarradMarketplace

Install Dependencies:

    For the backend:

cd server
npm install

For the frontend:

    cd client
    npm install

Database Setup:

    The backend will automatically create an SQLite database (store.db) and initialize the schema when the server starts.

Start the Backend:

cd server
npm run dev

Start the Frontend:

    cd client
    npm start

    Access the Application: Open http://localhost:3000 in your browser.

Directory Structure
Backend (Server)

server/
├── src/
│   ├── db/         # Database logic (SQLite)
│   ├── routes/     # RESTful API routes
│   ├── utils/      # Utility functions
│   ├── index.ts    # Main server file

Frontend (Client)

client/
├── src/
│   ├── components/   # Reusable React components
│   ├── context/      # Context API for state management
│   ├── pages/        # Individual page components
│   ├── App.tsx       # Main React app
│   ├── index.tsx     # React entry point

API Endpoints
Authentication
Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	User login
Products
Method	Endpoint	Description
GET	/products	Get all products
GET	/products/:id	Get product by ID
POST	/products	Add a new product
Cart
Method	Endpoint	Description
GET	/cart	View items in cart
POST	/cart	Add item to cart
DELETE	/cart/:productId	Remove item from cart
Orders
Method	Endpoint	Description
GET	/orders/:userId	Get all orders for a user
POST	/orders	Create a new order
Future Improvements

    Enhanced Filtering and Search:
        Search products by name, price range, and features.

    Wishlist Management:
        Save favorite products for future reference.

    User Reviews:
        Add and display product reviews.

    Stripe Integration:
        Implement real payment processing.

    Shipping and Delivery Tracking:
        Provide real-time tracking of orders.

Contributing

Contributions are welcome! Please follow these steps:

    Fork the repository.
    Create a new branch: git checkout -b feature-name.
    Commit your changes: git commit -m 'Add some feature'.
    Push to the branch: git push origin feature-name.
    Open a pull request.

License

This project is licensed under the MIT License. See the LICENSE file for details.