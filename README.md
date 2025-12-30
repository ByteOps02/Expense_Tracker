# Expense Tracker

A comprehensive, full-stack web application for personal finance management, designed to help users track income, manage expenses, and monitor budgets with an intuitive and responsive interface.

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-informational?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloud-Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)

---

## ✨ Features

- 🔐 **Secure Authentication:** JWT-based user registration and login with `bcryptjs` for secure password storage and user profile picture uploads to Cloudinary.
- 🖐️ **Biometric Authentication:** WebAuthn integration for enhanced security and a passwordless login experience.
- 📊 **Interactive Dashboard:** Real-time financial overview, recent transactions, and data visualization through interactive charts for income and expenses.
- 💰 **Income & Expense Management:** Full CRUD operations for financial records, with data export functionality to Excel.
- 📱 **Responsive & Modern UI:** Built with React and Tailwind CSS for a mobile-first, intuitive user experience, featuring `Recharts` for data visualizations.
- 🛡️ **Robust Security:** Secure API routes, input validation, and error handling to protect data integrity.
- ⚡ **Optimized Performance:** Efficient frontend development with Vite and a robust Node.js/Express.js backend.

---

## 🛠️ Tech Stack

**Frontend:**
- **React (v18+):** User interface development.
- **Vite:** Fast build tool and development server.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **React Router DOM:** Declarative routing for React.
- **Axios:** HTTP client for API requests.
- **Recharts:** Composable charting library.
- **Framer Motion:** Animation library.
- **Lucide React:** Icon library.

**Backend:**
- **Node.js (v18+):** JavaScript runtime environment.
- **Express.js:** Web application framework for APIs.
- **MongoDB:** NoSQL database.
- **Mongoose:** ODM for MongoDB.
- **JWT:** Token-based authentication.
- **bcryptjs:** Password hashing.
- **Multer:** Middleware for handling `multipart/form-data`.
- **Cloudinary:** Cloud-based image storage.
- **ExcelJS:** Library for generating Excel files.
- **WebAuthn (via `base64url`, `cbor`):** Biometric authentication.

---

## 📦 Folder Structure

```
Expense_Tracker/
├── .git/               # Git version control
├── .gitignore          # Global Git ignore file
├── package.json        # Root package dependencies
├── README.md           # Project documentation
├── vercel.json         # Vercel monorepo configuration
├── Backend/
│   ├── .env.example    # Example environment variables
│   ├── .gitignore      # Git ignore for backend
│   ├── api/            # Serverless function entry points (e.g., for Vercel)
│   │   └── index.js    # Entry point for backend serverless function
│   ├── config/         # Database and Cloudinary configuration
│   ├── controllers/    # Business logic for routes
│   ├── middleware/     # Custom Express middleware
│   ├── models/         # Mongoose schemas and models
│   ├── routes/         # API route definitions
│   ├── package.json    # Backend dependencies
│   ├── server.js       # Main backend server entry point
│   └── vercel.json     # Backend-specific Vercel configuration
├── Frontend/
│   ├── .env.example    # Example environment variables
│   ├── .gitignore      # Git ignore for frontend
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── assets/     # Images, icons
│   │   ├── components/ # Reusable React components
│   │   ├── context/    # React Context API providers
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Application views/pages
│   │   └── utils/      # Utility functions and API configurations
│   ├── package.json    # Frontend dependencies
│   ├── index.html      # Main HTML file
│   ├── vite.config.js  # Vite build configuration
│   └── vercel.json     # Frontend-specific Vercel configuration
```

---

## ⚙️ Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or higher)
-   [npm](https://www.npmjs.com/) (v9 or higher)
-   [MongoDB](https://www.mongodb.com/try/download/community) (local installation or cloud service like MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/ByteOps02/Expense_Tracker.git
cd Expense_Tracker
```

### 2. Backend Setup

Navigate to the `Backend` directory, install dependencies, and configure environment variables.

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory and populate it with the required environment variables (see `Environment Variables` section below).

```bash
npm run dev
```

The backend server will start on `http://localhost:5000` (or your specified PORT).

### 3. Frontend Setup

Navigate to the `Frontend` directory, install dependencies, and configure environment variables.

```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory and populate it with the required environment variables.

```bash
npm run dev
```

The frontend development server will start on `http://localhost:5173`.

---

## 🔑 Environment Variables

### Backend (`Backend/.env`)

| Variable                  | Description                                  | Example Value                                  |
| :------------------------ | :------------------------------------------- | :--------------------------------------------- |
| `MONGO_URI`               | MongoDB connection string.                   | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `JWT_SECRET`              | Secret key for JWT authentication.           | `your_super_secret_jwt_key`                    |
| `PORT`                    | Port for the backend server.                 | `5000`                                         |
| `CLIENT_URL`              | URL of the frontend application (for CORS).  | `http://localhost:5173`                        |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name.                       | `your_cloud_name`                              |
| `CLOUDINARY_API_KEY`      | Cloudinary API key.                          | `your_api_key`                                 |
| `CLOUDINARY_API_SECRET`   | Cloudinary API secret.                       | `your_api_secret`                              |

### Frontend (`Frontend/.env`)

| Variable        | Description                       | Example Value           |
| :-------------- | :---------------------------------| :---------------------- |
| `VITE_BASE_URL` | Base URL of the backend API.      | `http://localhost:5000` |

---

## 🚀 Deployment (Vercel)

This project is configured for seamless deployment on Vercel, utilizing its monorepo support for both frontend (static assets) and backend (serverless functions).

### Configuration

Ensure that your `vercel.json` files in both `Backend/` and `Frontend/` directories are correctly set up, and that all necessary environment variables are configured in your Vercel project settings.

### Backend Deployment

The `Backend/api/index.js` serves as the entry point for the backend serverless function. Configure environment variables like `MONGO_URI`, `JWT_SECRET`, and Cloudinary credentials directly in your Vercel project dashboard.

### Frontend Deployment

The `Frontend/` directory contains the React application. Ensure the `VITE_BASE_URL` environment variable in Vercel is set to the URL of your deployed backend API.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss any major changes or new features you'd like to implement. For direct code contributions, please submit a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
