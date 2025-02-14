# Unipay

### University Fee Payment and Insights Platform

A comprehensive and user-friendly fee payment platform designed specifically for university students. Built using the MERN stack (MongoDB, Express, React, Node.js), this application streamlines the fee payment process and provides fee insights via Discord and payment integration via Razorpay.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm (comes with Node.js)
- [MongoDB](https://www.mongodb.com/)

### Installation

Follow these steps to set up the project locally.

#### 1. Clone the repository

```bash
git clone https://github.com/samrathreddy/Unipay.git
cd Unipay
```

#### 2. Install dependencies

```bash
cd frontend
npm install
```

```bash
cd server
npm install
```

#### 3. Create a .env File

#### In the server directory, create a file named .env and add the following variables:

```bash
SECRET_KEY=your_secret_key
MONGO_URL=your_mongo_connection_string

RAZORPAY_API_KEY=your_razorpay_api_key
RAZORPAY_API_SECRET=your_razorpay_api_secret

email=your_email
emailPass=your_email_password

DISCORD_TOKEN=your_discord_bot_token
ADMIN_CHANNEL_ID=your_admin_channel_id
VERIFIED_CHANNEL_ID=your_verified_channel_id
REJECTED_CHANNEL_ID=your_rejected_channel_id
```

Replace the placeholder values with your actual credentials.

#### 4.Running the Application

#### Frontend

Navigate to the frontend directory and start the React development server:

```bash
cd frontend
npm run start
```

This will run the app in development mode. Open http://localhost:3000 to view it in your browser. The page will reload if you make edits. You will also see any lint errors in the console.

#### Backend

Navigate to the client directory and start the Express server with nodemon:

```bash
cd server
npm run start
```

This will start the server on http://localhost:8000 and restart it automatically if there are any changes to the code.

## ⚠️ Rate Limits / Expiration

- **Local Storage Token expiry** - 5 mins (frontend/Components/RollNumberForm.js)
- **Bearer expiry** - 5 mins (server/routes/feeRoute.js)
- **API Rate Limit** - 40 requests per 15 mins (server/middlewares/validateInputMiddleware)

## 🛠️ Stack Used

### Frontend

- **React** - A JavaScript library for building user interfaces

### Backend

- **Node.js** - JavaScript runtime built on Chrome's V8 engine
- **Express** - Fast, unopinionated, minimalist web framework for Node.js

### Database

- **MongoDB** - NoSQL database for storing and retrieving data

### Payment Integration

- **Razorpay** - Payment gateway for processing secure and seamless transactions

### Real-time Notifications

- **Discord** - For instant notifications, updates and admin operations
