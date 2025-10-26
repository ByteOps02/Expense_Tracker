# Expense Tracker

A modern, full-stack web application to track your personal income and expenses, featuring a beautiful, responsive UI and robust backend.

<p align="center">
  <b>Track. Analyze. Succeed.</b>
</p>

---

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-informational?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://react.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

---

## ✨ Features

- 🔐 **Secure Authentication:**
  - JWT-based registration and login system.
  - Password hashing using `bcryptjs`.
  - Profile photo uploads.
- 🖐️ **Biometric Authentication:**
  - Support for passwordless login using WebAuthn for a seamless and secure user experience.
  - Register and manage multiple passkeys.
- 📊 **Interactive Dashboard:**
  - Real-time financial statistics.
  - Overview of recent transactions.
  - Charts and graphs to visualize income and expenses.
- 💰 **Income & Expense Management:**
  - Add, view, update, and delete income and expense records.
  - Export your financial data to Excel for offline analysis.
- 📱 **Responsive & Modern UI:**
  - Built with React and Tailwind CSS for a mobile-first, modern, and intuitive user interface.
  - Uses `Recharts` for beautiful and interactive charts.
- 🛡️ **Robust Security:**
  - Protected API routes to ensure data privacy.
  - Input validation to prevent common vulnerabilities.
- ⚡ **Optimized Performance:**
  - Fast and modern frontend build with Vite.
  - Efficient backend with Node.js and Express.

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
- **ExcelJS:** For generating Excel files.
- **WebAuthn (via `base64url`, `cbor`):** For biometric authentication.

---

## 📦 Folder Structure

```
Expense_Tracker/
├── Backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Application logic
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded files
│   ├── utils/          # Utility functions
│   ├── package.json
│   └── server.js       # Server entry point
├── Frontend/
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── assets/     # Images, icons, etc.
│   │   ├── components/ # Reusable React components
│   │   ├── context/    # React context providers
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Application pages
│   │   └── utils/      # Utility functions
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

### 1. Clone the repository
```bash
git clone <repo-url>
cd Expense_Tracker
```

### 2. Backend Setup
```bash
cd Backend
npm install
# Create a .env file (see below for required variables)
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

Create a `.env` file in the `Backend/` directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000                # Optional, defaults to 5000
CLIENT_URL=http://localhost:5173  # Frontend URL for CORS
```

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

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.
