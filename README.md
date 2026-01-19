# Expense Tracker

A comprehensive, full-stack web application for personal finance management, designed to help users track income, manage expenses, and monitor budgets with an intuitive and responsive interface. Built with modern technologies and deployed on Vercel for seamless scalability.

---
[![Node.js](https://img.shields.io/badge/Backend-Node.js-informational?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/API-Express.js-90C53F?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloud-Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

---

## ✨ Features

- 🔐 **Secure Authentication:** JWT-based user registration and login with `bcryptjs` for secure password storage and user profile picture uploads to Cloudinary.
- 🖐️ **Biometric Authentication:** WebAuthn integration for enhanced security and a passwordless login experience using `base64url` and `cbor` libraries.
- 📊 **Interactive Dashboard:** Real-time financial overview with recent transactions and data visualization through multiple chart types (bar, line, doughnut charts).
- 💰 **Complete Income & Expense Management:** Full CRUD operations for financial records with categorization, dates, descriptions, and notes.
- 💵 **Budget Tracking:** Create and manage budgets with recurring options (daily, weekly, monthly, annually) to monitor spending limits.
- 📈 **Advanced Analytics:** Multiple visualization options including Recharts and Chart.js for comprehensive financial insights.
- 📱 **Responsive & Modern UI:** Built with React 19 and Tailwind CSS for a mobile-first, intuitive user experience with Framer Motion animations.
- 🛡️ **Robust Security:** 
  - JWT token authentication with 1-hour expiration
  - Rate limiting on authentication and upload endpoints
  - Input validation and sanitization with express-validator
  - Security headers via Helmet middleware
  - CORS configuration for secure cross-origin requests
  - Comprehensive error handling middleware
- ⚡ **Optimized Performance:** 
  - Efficient frontend development with Vite
  - Lazy loading for React components
  - Gzip compression on backend responses
  - MongoDB connection pooling
  - Optimized database indexes
- 🌐 **Cross-Platform Support:** Supports both web browsers and mobile applications.
- 🚀 **Vercel Deployment Ready:** Serverless function architecture for scalable deployment.

---

## 🛠️ Tech Stack

### Frontend
- **React (v19+):** Modern UI library with Hooks and Suspense support for server-side code splitting.
- **Vite (v7+):** Lightning-fast build tool and development server with HMR support.
- **Tailwind CSS (v4+):** Utility-first CSS framework with Vite plugin for optimized builds.
- **React Router DOM (v7+):** Client-side routing for single-page application navigation.
- **Axios (v1.11+):** Promise-based HTTP client for API communication.
- **Recharts (v3.3+):** Composable charting library built on React components for financial data visualization.
- **Chart.js (v4.5+) & react-chartjs-2 (v5+):** Advanced charting with responsive bar, line, and doughnut charts.
- **Framer Motion (v12+):** Animation library for smooth UI transitions and interactions.
- **Lucide React (v0.548+) & React Icons (v5.5+):** Comprehensive icon libraries for UI elements.
- **Emoji Picker React (v4.14+):** Interactive emoji picker component.
- **Moment.js (v2.30+):** Date and time formatting utilities.
- **Base64url (v3.0+):** Encoding library for WebAuthn credential handling.

### Backend
- **Node.js (v18+):** JavaScript runtime environment for server-side development.
- **Express.js (v5.1+):** Lightweight web application framework for building REST APIs.
- **MongoDB (with Mongoose v8.19+):** NoSQL database with Object Data Modeling for schema validation and management.
- **JWT (jsonwebtoken v9.0+):** Token-based authentication for stateless security.
- **bcryptjs (v3.0+):** Password hashing and verification with salt rounds.
- **Multer (v2.0+):** Middleware for handling multipart/form-data file uploads.
- **Cloudinary (v2.8+):** Cloud-based image storage and manipulation service.
- **ExcelJS (v4.4+):** Library for generating Excel files for data export.
- **WebAuthn Support (base64url v3.0+, cbor v10.0+):** Libraries for biometric authentication.
- **Helmet (v8.1+):** Security middleware for setting HTTP headers.
- **Express Rate Limit (v8.2+):** Rate limiting middleware for DDoS protection.
- **Express Validator (v7.3+):** Input validation and sanitization middleware.
- **Compression (v1.7+):** Gzip compression middleware for response optimization.
- **CORS (v2.8+):** Cross-Origin Resource Sharing middleware for secure cross-origin requests.
- **Speakeasy (v2.0+):** Two-factor authentication support.
- **Node Cache (v5.1+):** In-memory caching for improved performance.
- **Dotenv (v17.2+):** Environment variable management.

### Development Tools
- **ESLint:** Code quality and style checking.
- **Prettier:** Code formatting for consistency.
- **Nodemon (v3.1+):** Auto-restart development server on file changes.
- **Supertest (v7.1+):** HTTP assertion library for API testing.

---

## 📦 Project Structure

```
Expense_Tracker/
├── .git/                   # Git version control
├── .gitignore              # Global Git ignore file
├── package.json            # Root package configuration
├── README.md               # Project documentation
├── SECURITY.md             # Security guidelines
├── vercel.json             # Vercel monorepo configuration
│
├── Backend/                # Node.js/Express API Server
│   ├── server.js           # Main application entry point with middleware setup
│   ├── package.json        # Backend dependencies (express, mongoose, jwt, etc.)
│   ├── eslint.config.js    # ESLint configuration
│   ├── vercel.json         # Serverless deployment configuration
│   │
│   ├── api/
│   │   └── index.js        # Vercel serverless function entry point
│   │
│   ├── config/
│   │   ├── cloudinary.js   # Cloudinary service configuration
│   │   └── db.js           # MongoDB connection with pooling settings
│   │
│   ├── models/             # Mongoose schemas
│   │   ├── User.js         # User schema with password hashing middleware
│   │   ├── Expense.js      # Expense schema with category and date indexing
│   │   ├── Income.js       # Income schema with source tracking
│   │   └── Budget.js       # Budget schema with recurring options
│   │
│   ├── controllers/        # Business logic handlers
│   │   ├── authController.js           # Registration, login, password management
│   │   ├── expenseController.js        # CRUD operations for expenses
│   │   ├── incomeController.js         # CRUD operations for income
│   │   ├── budgetController.js         # Budget creation and management
│   │   ├── dashboardController.js      # Dashboard statistics and analytics
│   │   └── transactionController.js    # Combined transaction handling
│   │
│   ├── routes/             # API endpoints
│   │   ├── authRoutes.js               # /api/v1/auth endpoints
│   │   ├── expenseRoutes.js            # /api/v1/expense endpoints
│   │   ├── incomeRoutes.js             # /api/v1/income endpoints
│   │   ├── budgetRoutes.js             # /api/v1/budgets endpoints
│   │   ├── dashboardRoutes.js          # /api/v1/dashboard endpoints
│   │   └── transactionRoutes.js        # /api/v1/transactions endpoints
│   │
│   ├── middleware/         # Express middleware
│   │   ├── authMiddleware.js           # JWT token verification
│   │   ├── errorMiddleware.js          # Global error handling
│   │   ├── validationMiddleware.js     # Input validation with express-validator
│   │   └── uploadMiddleware.js         # Multer file upload configuration
│   │
│   └── utils/              # Helper utilities
│       ├── asyncHandler.js # Wrapper for async route handlers
│       └── AppError.js     # Custom error class
│
├── Frontend/               # React/Vite Web Application
│   ├── index.html          # Main HTML entry point
│   ├── package.json        # Frontend dependencies (react, vite, tailwind, etc.)
│   ├── vite.config.js      # Vite build configuration with React plugin
│   ├── eslint.config.js    # ESLint configuration
│   ├── vercel.json         # Static site deployment configuration
│   │
│   ├── public/
│   │   └── robots.txt      # SEO robots configuration
│   │
│   └── src/
│       ├── main.jsx        # React DOM root entry point
│       ├── App.jsx         # Main app component with routing and providers
│       ├── index.css       # Global styles and Tailwind directives
│       │
│       ├── assets/
│       │   └── images/     # Static image assets
│       │
│       ├── components/     # Reusable React components
│       │   ├── ErrorBoundary.jsx           # Error boundary for error handling
│       │   ├── LoadingSpinner.jsx          # Loading state component
│       │   │
│       │   ├── Budget/                     # Budget-related components
│       │   │   ├── AddBudgetForm.jsx       # Budget creation form
│       │   │   ├── BudgetList.jsx          # Budget list display
│       │   │   └── BudgetOverview.jsx      # Budget statistics
│       │   │
│       │   ├── Expense/                    # Expense-related components
│       │   │   ├── AddExpenseForm.jsx      # Expense entry form
│       │   │   ├── ExpenseList.jsx         # Expense list display
│       │   │   └── ExpenseOverview.jsx     # Expense statistics
│       │   │
│       │   ├── Income/                     # Income-related components
│       │   │   ├── AddIncomeForm.jsx       # Income entry form
│       │   │   ├── IncomeList.jsx          # Income list display
│       │   │   └── IncomeOverview.jsx      # Income statistics
│       │   │
│       │   ├── Cards/                      # Card components
│       │   │   ├── CharAvatar.jsx          # Character avatar display
│       │   │   ├── InfoCard.jsx            # Generic info card
│       │   │   └── TransactionInfoCard.jsx # Transaction card
│       │   │
│       │   ├── Charts/                     # Chart visualization components
│       │   │   ├── ChartJsBarChart.jsx     # Bar chart using Chart.js
│       │   │   ├── ChartJsDoughnutChart.jsx# Doughnut chart using Chart.js
│       │   │   ├── ChartJsLineChart.jsx    # Line chart using Chart.js
│       │   │   ├── CustomLegend.jsx        # Custom legend component
│       │   │   └── CustomTooltip.jsx       # Custom tooltip for charts
│       │   │
│       │   ├── Dashboard/                  # Dashboard-specific components
│       │   │   ├── FinanceOverview.jsx     # Financial summary dashboard
│       │   │   ├── ExpenseTransactions.jsx # Expense transaction display
│       │   │   ├── RecentIncome.jsx        # Recent income section
│       │   │   ├── RecentIncomeWithChart.jsx# Income with chart visualization
│       │   │   ├── RecentTransactions.jsx  # All recent transactions
│       │   │   └── CustomTooltip.jsx       # Dashboard-specific tooltip
│       │   │
│       │   ├── Inputs/                     # Input components
│       │   │   ├── ModernDatePicker.jsx    # Date selection component
│       │   │   └── ProfilePhotoSelector.jsx# Profile photo upload
│       │   │
│       │   └── layouts/                    # Layout components
│       │       ├── Navbar.jsx              # Top navigation bar
│       │       ├── SideMenu.jsx            # Sidebar navigation
│       │       ├── DashboardLayout.jsx     # Main dashboard layout wrapper
│       │       ├── Modal.jsx               # Modal dialog component
│       │       ├── AuthBranding.jsx        # Auth page branding
│       │       └── EmojiPickerPopup.jsx    # Emoji selection popup
│       │
│       ├── context/        # React Context API providers
│       │   ├── UserContext.jsx             # User context provider with state management
│       │   ├── UserContextDefinition.js    # User context definition
│       │   └── ThemeContext.jsx            # Dark/light theme provider
│       │
│       ├── hooks/          # Custom React hooks
│       │   ├── useTheme.js  # Theme toggle hook
│       │   └── useUserAuth.jsx # Authentication state hook
│       │
│       ├── pages/          # Page components (routes)
│       │   ├── Auth/
│       │   │   ├── Login.jsx               # Login page
│       │   │   └── SignUp.jsx              # Registration page
│       │   │
│       │   └── Dashboard/  # Protected dashboard pages
│       │       ├── Home.jsx                # Dashboard home page
│       │       ├── Income.jsx              # Income management page
│       │       ├── Expense.jsx             # Expense management page
│       │       ├── Budget.jsx              # Budget management page
│       │       ├── Settings.jsx            # User settings page
│       │       └── RecentTransactionsPage.jsx # Detailed transactions page
│       │
│       └── utils/          # Utility functions
│           ├── apiPath.js              # API endpoint configurations
│           ├── axiosInstance.js        # Axios configuration with interceptors
│           ├── data.js                 # Hardcoded data and constants
│           ├── helper.js               # General helper functions
│           └── uploadImage.js          # Image upload utility
```

## 📊 Data Models

### User Model
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  profileImageUrl: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Expense Model
```javascript
{
  user: ObjectId (ref: User, required),
  title: String (required),
  amount: Number (required),
  category: String (required),
  description: String,
  notes: String,
  icon: String,
  date: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```
Indexes: `{user: 1, date: -1}`, `{user: 1}`, `{date: -1}`

### Income Model
```javascript
{
  user: ObjectId (ref: User, required),
  title: String (required),
  amount: Number (required),
  source: String (required),
  note: String,
  icon: String,
  date: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```
Indexes: `{user: 1, date: -1}`, `{user: 1}`, `{date: -1}`

### Budget Model
```javascript
{
  user: ObjectId (ref: User, required),
  category: String (required),
  amount: Number (required, min: 0),
  startDate: Date (required),
  endDate: Date (required),
  isRecurring: Boolean (default: false),
  recurrenceType: String (enum: ['daily', 'weekly', 'monthly', 'annually', null]),
  createdAt: Date,
  updatedAt: Date
}
```
Indexes: `{user: 1, startDate: 1, endDate: 1}`, `{user: 1, category: 1, startDate: 1}`

---

## ⚙️ Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation or cloud service like MongoDB Atlas)
- [Cloudinary Account](https://cloudinary.com/) (for image storage)

### 1. Clone the Repository

```bash
git clone https://github.com/ByteOps02/Expense_Tracker.git
cd Expense_Tracker
```

### 2. Backend Setup

Navigate to the `Backend` directory, install dependencies, and configure environment variables:

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory (refer to the `.env.example` file and the Environment Variables section below):

```bash
npm run dev
```

The backend server will start on `http://localhost:5000` (or your specified PORT).

**Backend Scripts:**
- `npm run dev` - Start development server with Nodemon (auto-restart on file changes)
- `npm start` - Start production server

### 3. Frontend Setup

Navigate to the `Frontend` directory, install dependencies, and configure environment variables:

```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory (refer to the `.env.example` file):

```bash
npm run dev
```

The frontend development server will start on `http://localhost:5173`.

**Frontend Scripts:**
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173` to access the expense tracker application.

---

## 🔑 Environment Variables

### Backend (`Backend/.env`)

> **⚠️ Important:** Never commit `.env` files with actual credentials. Copy `.env.example` to `.env` and fill in your actual values.

| Variable                     | Description                                | Example Value |
|:---------                    |:------------                               |:--------------|
| `MONGO_URI`                  | MongoDB connection string (Atlas or local) | `mongodb+srv://your_username:your_password@your_cluster.mongodb.net/expense_tracker` |
| `JWT_SECRET`                 | Secret key for JWT token signing           | `your_super_secret_jwt_key_min_32_characters_recommended` |
| `PORT`                       | Backend server port                        | `5000` |
| `CLIENT_URL`                 | Frontend application URL(s) for CORS       | `http://localhost:5173` or `http://localhost:5173,https://yourdomain.com` |
| `CLOUDINARY_CLOUD_NAME`      | Cloudinary cloud name                      | `your_cloud_name` |
| `CLOUDINARY_API_KEY`         | Cloudinary API key                         | `your_api_key` |
| `CLOUDINARY_API_SECRET`      | Cloudinary API secret                      | `your_api_secret_key` |
| `NODE_ENV`                   | Environment mode                           | `development` or `production` |

**Setup Instructions:**
1. Copy the example file: `cp Backend/.env.example Backend/.env`
2. Fill in your actual values from the services:
   - MongoDB Atlas credentials
   - JWT secret (generate with: `openssl rand -base64 32`)
   - Cloudinary credentials

**Example `.env` file:**
```env
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/expense_tracker
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_recommended
PORT=5000
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret_key
NODE_ENV=development
```

### Frontend (`Frontend/.env`)

| Variable        | Description          | Example Value |
|:---------       |:------------         |:--------------|
| `VITE_BASE_URL` | Backend API base URL | `http://localhost:5000` |

**Example `.env` file:**
```env
VITE_BASE_URL=http://localhost:5000
```

## 🔒 Security Features

- **JWT Authentication:** Tokens expire after 1 hour for enhanced security
- **Rate Limiting:** 
  - General API: 100 requests per 15 minutes
  - Authentication: 50 requests per 15 minutes
  - Image Upload: 20 uploads per 15 minutes
- **Helmet Middleware:** Protects against common web vulnerabilities by setting HTTP headers
- **CORS Security:** Configurable allowed origins with dynamic verification
- **Password Hashing:** Bcryptjs with salt rounds for secure password storage
- **Input Validation:** Express-validator for sanitization and validation of all inputs
- **Error Handling:** Comprehensive error middleware prevents information leakage
- **WebAuthn Support:** Optional biometric authentication for enhanced security

## 🚀 API Endpoints

### Authentication Routes (`/api/v1/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login with credentials
- `GET /getUser` - Get current user info (protected)
- `PUT /update` - Update user profile (protected)
- `POST /change-password` - Change user password (protected)
- `POST /upload-image` - Upload profile image

### Expense Routes (`/api/v1/expense`)
- `GET /` - Get all expenses (protected)
- `POST /` - Create new expense (protected)
- `GET /:id` - Get specific expense (protected)
- `PUT /:id` - Update expense (protected)
- `DELETE /:id` - Delete expense (protected)

### Income Routes (`/api/v1/income`)
- `GET /` - Get all income records (protected)
- `POST /` - Create new income record (protected)
- `GET /:id` - Get specific income record (protected)
- `PUT /:id` - Update income record (protected)
- `DELETE /:id` - Delete income record (protected)

### Budget Routes (`/api/v1/budgets`)
- `GET /` - Get all budgets (protected)
- `POST /` - Create new budget (protected)
- `GET /:id` - Get specific budget (protected)
- `PUT /:id` - Update budget (protected)
- `DELETE /:id` - Delete budget (protected)

### Dashboard Routes (`/api/v1/dashboard`)
- `GET /` - Get dashboard overview data (protected)
- `GET /statistics` - Get financial statistics (protected)

### Transaction Routes (`/api/v1/transactions`)
- `GET /` - Get all transactions (protected)
- `GET /export` - Export transactions as Excel (protected)

## 🚀 Deployment (Vercel)

This project is configured for seamless deployment on Vercel, utilizing its monorepo support for both frontend (static site) and backend (serverless functions).

### Deployment Architecture

- **Frontend:** Static site deployment to Vercel's CDN (automatic builds from `/Frontend` directory)
- **Backend:** Serverless functions deployment using `/Backend/api/index.js` entry point

### Prerequisites for Deployment

1. Create a [Vercel Account](https://vercel.com/signup)
2. Connect your GitHub repository to Vercel
3. Set up environment variables in Vercel project dashboard

### Configuration Files

Both directories contain `vercel.json` files configured for optimal deployment:

**Backend (Backend/vercel.json):**
- Configures serverless function routes
- Sets build directory and output settings

**Frontend (Frontend/vercel.json):**
- Configures static site settings
- Sets up rewrites for client-side routing

### Setting Up Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all required backend environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Add frontend environment variables:
   - `VITE_BASE_URL` (set to your Vercel backend API URL)

### Deployment Steps

1. **Initial Setup:**
   ```bash
   # Ensure both vercel.json files exist
   # Update environment variables in Vercel dashboard
   ```

2. **Automatic Deployment:**
   - Push changes to your `main` branch
   - Vercel automatically builds and deploys both frontend and backend
   - Frontend builds from `Frontend/` directory
   - Backend builds serverless functions from `Backend/` directory

3. **Manual Deployment:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy from project root
   vercel
   ```

### Post-Deployment Verification

- Access your frontend at `https://your-project.vercel.app`
- Backend API endpoints available at `https://your-project.vercel.app/api/v1/*`
- Check Vercel dashboard for deployment logs and analytics

### Troubleshooting Deployment

- **CORS Issues:** Verify `CLIENT_URL` environment variable includes your Vercel domain
- **Database Connection:** Ensure `MONGO_URI` is accessible from Vercel servers
- **Missing Images:** Verify Cloudinary credentials are correctly set
- **Build Failures:** Check Vercel build logs for specific error messages

---

## 🔧 Development Workflow

### Running Both Frontend and Backend Locally

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

The application will be available at `http://localhost:5173` with the backend running on `http://localhost:5000`.

### Hot Module Replacement (HMR)

Both frontend and backend support HMR during development:
- **Frontend:** Vite provides instant HMR for React components
- **Backend:** Nodemon automatically restarts the server on file changes

### Testing API Endpoints

Use tools like:
- [Postman](https://www.postman.com/) - GUI-based API testing
- [Thunder Client](https://www.thunderclient.com/) - VS Code extension
- `curl` - Command-line API testing

Example:
```bash
# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

---

## 📈 Performance Optimization

### Frontend Optimizations
- **Code Splitting:** Lazy loading of page components with React.lazy and Suspense
- **Tree Shaking:** Unused code removal during Vite build
- **Component Optimization:** React.memo for preventing unnecessary re-renders
- **CSS Optimization:** Tailwind CSS purges unused styles in production

### Backend Optimizations
- **Database Indexing:** Strategic indexes on frequently queried fields
- **Connection Pooling:** MongoDB connection pool with min/max settings
- **Response Compression:** Gzip compression on all API responses
- **Caching:** Node-cache for frequently accessed data
- **Rate Limiting:** Prevents abuse and DDoS attacks

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes** and test thoroughly
4. **Commit** with clear messages (`git commit -m 'Add AmazingFeature'`)
5. **Push** to the branch (`git push origin feature/AmazingFeature`)
6. **Open a Pull Request** with a description of changes

### Code Style

- Follow ESLint rules configured in `.eslintrc.js`
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🆘 Support

For support, please:

1. Check the [Issues](https://github.com/ByteOps02/Expense_Tracker/issues) page
2. Open a new issue with detailed information
3. Include error messages and steps to reproduce

---

## 👨‍💻 Author

**Ram Krishna** - Initial project development

---

## 🙏 Acknowledgments

- React and Vite communities
- Cloudinary for cloud storage
- MongoDB for database solutions
- All open-source libraries used in this project