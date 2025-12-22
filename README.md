# Expense Tracker

A modern, full-stack web application designed for comprehensive personal income and expense tracking. It features a responsive user interface and a robust backend architecture.

<p align="center">
  <b>Track. Analyze. Succeed.</b>
</p>

---

[![Node.js](https://img.shields.io/badge/Backend-Node.js-informational?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://react.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

---

## ✨ Features

- 🔐 **Secure Authentication:**
  - Implements a JWT-based authentication system for user registration and login.
  - Ensures secure password storage through `bcryptjs` hashing.
  - Supports user profile picture uploads.
- 🖐️ **Biometric Authentication:**
  - Integrates WebAuthn for passwordless authentication, enhancing both security and user experience.
  - Facilitates the registration and management of multiple passkeys.
- 📊 **Interactive Dashboard:**
  - Presents real-time financial statistics.
  - Provides an overview of recent transactions.
  - Visualizes financial data through interactive charts and graphs for income and expenses.
- 💰 **Income & Expense Management:**
  - Facilitates full CRUD (Create, Read, Update, Delete) operations for income and expense records.
  - Enables data export to Excel format for offline analytical purposes.
- 📱 **Responsive & Modern UI:**
  - Constructed with React and Tailwind CSS, providing a mobile-first, modern, and intuitive user experience.
  - Leverages `Recharts` for the generation of visually appealing and interactive data visualizations.
- 🛡️ **Robust Security:**
  - Secures API routes to uphold data privacy and integrity.
  - Incorporates robust input validation to mitigate common web vulnerabilities.
- ⚡ **Optimized Performance:**
  - Optimized frontend performance achieved through Vite's modern build tooling.
  - Powered by an efficient backend built with Node.js and the Express.js framework.

---

## 🛠️ Tech Stack

**Frontend:**
- **React 19:** For building the user interface.
- **Vite:** As the build tool and development server.
- **Tailwind CSS:** For styling the application.
- **React Router DOM:** For client-side routing.
- **Axios:** For making HTTP requests to the backend.
- **Recharts:** For creating interactive charts.
- **Framer Motion:** For animations.
- **Lucide React:** For icons.

**Backend:**
- **Node.js:** As the JavaScript runtime environment.
- **Express.js:** As the web framework for building the API.
- **MongoDB:** As the NoSQL database for storing data.
- **Mongoose:** As the ODM for MongoDB.
- **JWT (JSON Web Tokens):** For authentication.
- **bcryptjs:** For password hashing.
- **Multer:** For handling file uploads.
- **Cloudinary:** For cloud-based image storage and management.
- **ExcelJS:** For generating Excel files.
- **WebAuthn (via `base64url`, `cbor`):** For biometric authentication.

---

## 📦 Folder Structure

```
Expense_Tracker/
├── .git/               # Git version control
├── .gitignore          # Git ignore file
├── package.json        # Root package dependencies
├── README.md           # Project documentation
├── vercel.json         # Vercel deployment configuration
├── Backend/
│   ├── .gitignore      # Git ignore file for backend
│   ├── api/            # Serverless functions (e.g., for Vercel)
│   │   └── index.js    # Entry point for serverless function
│   ├── config/         # Database configuration
│   ├── controllers/    # Application logic
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded files
│   ├── eslint.config.js # ESLint configuration
│   ├── package.json    # Backend dependencies
│   ├── server.js       # Server entry point
│   └── vercel.json     # Vercel deployment configuration
├── Frontend/
│   ├── .gitignore      # Git ignore file for frontend
│   ├── hooks/          # Custom React hooks
│   │   └── useUserAuth.jsx
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── assets/     # Images, icons, etc.
│   │   ├── components/ # Reusable React components
│   │   ├── context/    # React context providers
│   │   ├── pages/      # Application pages
│   │   └── utils/      # Utility functions
│   ├── eslint.config.js # ESLint configuration
│   ├── package.json    # Frontend dependencies
│   ├── index.html      # Main HTML file
│   ├── vite.config.js  # Vite configuration
│   └── vercel.json     # Vercel deployment configuration
```

---

## ⚙️ Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (version 6 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (standalone installation or MongoDB Atlas cloud service)

### 1. Clone the repository
```bash
git clone https://github.com/ByteOps02/Expense_Tracker.git
cd Expense_Tracker
```

### 2. Backend Setup
```bash
cd Backend
npm install
# Install recommended security middlewares
npm install helmet express-rate-limit express-mongo-sanitize xss-clean cookie-parser csurf
# Copy Backend/.env.example -> Backend/.env and populate values
npm run dev
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
npm run dev
```

The frontend will typically run on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## 📜 Available Scripts

### Backend

| Script  | Description                                  |
|---------|----------------------------------------------|
| `start` | Starts the server in production mode.        |
| `dev`   | Starts the server in development mode with nodemon. |

### Frontend

| Script    | Description                               |
|-----------|-------------------------------------------|
| `dev`     | Starts the Vite dev server.               |
| `build`   | Builds the app for production.            |
| `lint`    | Lints the code using ESLint.              |
| `preview` | Previews the production build locally.    |

---

## 🔑 Environment Variables

Template `.env.example` files have been added to both `Backend/` and `Frontend/`. Copy the appropriate example to a `.env` (or `.env.local`) file and fill in real values before running the app.

### Backend Environment Variables

Copy `Backend/.env.example` to `Backend/.env` and populate the values. Important variables include:

- `MONGO_URI` — MongoDB connection string (do NOT commit credentials)
- `JWT_SECRET` — Secret for signing JWT tokens
- `SESSION_SECRET` — Secret for express-session cookies
- `CLIENT_URL` — Frontend origin for CORS
- `NODE_ENV` / `PORT`
- **Cloudinary Configuration** (for image uploads):
  - `CLOUDINARY_CLOUD_NAME` — Your Cloudinary cloud name
  - `CLOUDINARY_API_KEY` — Your Cloudinary API key
  - `CLOUDINARY_API_SECRET` — Your Cloudinary API secret (do NOT commit)

To get Cloudinary credentials:
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Navigate to your Dashboard
3. Copy your **Cloud Name**, **API Key**, and **API Secret** from the Account Details section

### Frontend Environment Variables

Copy `Frontend/.env.example` to `Frontend/.env` (or `.env.local`) and set:

- `VITE_BASE_URL` — URL for the backend API (e.g. `http://localhost:5000`)

---

## 🔗 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | `/register`      | Register a new user.     |
| POST   | `/login`         | Log in a user.           |
| GET    | `/getUser`       | Get user information.    |
| POST   | `/upload-image`  | Upload a profile image.  |

### Biometric (`/api/biometric`)

| Method | Endpoint                  | Description                       |
|--------|---------------------------|-----------------------------------|
| POST   | `/attestation/options`    | Generate passkey registration options. |
| POST   | `/attestation/result`     | Verify and save a new passkey.    |
| POST   | `/assertion/options`      | Generate passkey login options.   |
| POST   | `/assertion/result`       | Verify a passkey and log in.      |
| GET    | `/passkeys`               | Get all passkeys for the user.    |
| DELETE | `/passkeys/:id`           | Delete a passkey.                 |

### Dashboard (`/api/dashboard`)

| Method | Endpoint | Description                  |
|--------|----------|------------------------------|
| GET    | `/`      | Get dashboard summary data.  |

### Expenses (`/api/expenses`)

| Method | Endpoint          | Description                   |
|--------|-------------------|-------------------------------|
| POST   | `/`               | Add a new expense.            |
| GET    | `/`               | Get all expenses.             |
| PUT    | `/:id`            | Update an expense.            |
| DELETE | `/:id`            | Delete an expense.            |
| GET    | `/download-excel` | Download expenses as Excel.   |

### Incomes (`/api/incomes`)

| Method | Endpoint          | Description                 |
|--------|-------------------|-----------------------------|
| POST   | `/`               | Add a new income.           |
| GET    | `/`               | Get all incomes.            |
| PUT    | `/:id`            | Update an income.           |
| DELETE | `/:id`            | Delete an income.           |
| GET    | `/download-excel` | Download incomes as Excel.  |

---

## 🚀 Deployment (Vercel)

This project is configured for deployment with Vercel. Both the frontend and backend can be deployed as serverless functions and static assets.

### Backend Deployment

The `Backend/vercel.json` file configures the Node.js backend to be deployed as a serverless function. Ensure your environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_API_KEY`) are configured in your Vercel project settings.

### Frontend Deployment

The `Frontend/vercel.json` file configures the React frontend to be deployed as static assets. Ensure the `VITE_BASE_URL` environment variable in your Vercel project settings points to your deployed backend API URL.

---
## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
