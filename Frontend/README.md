# Expense Tracker Frontend

A modern React-based frontend application for tracking personal income and expenses with a beautiful, responsive UI. The application is designed for Indian users and uses Indian Rupees (₹) as the primary currency.

## Features

### 🔐 Authentication
- User registration with profile photo upload
- Secure login/logout functionality
- Protected routes for authenticated users
- JWT token-based authentication

### 📊 Dashboard
- Overview of financial statistics in Indian Rupees (₹)
- Total balance, income, and expense tracking
- Recent transactions display
- Responsive design with modern UI

### 💰 Income Management
- Add new income entries with categories
- View income history in Indian Rupees
- Delete income records
- Export income data to Excel

### 💸 Expense Management
- Add new expense entries with categories
- View expense history in Indian Rupees
- Delete expense records
- Export expense data to Excel

### 🎨 UI/UX Features
- Modern, responsive design using Tailwind CSS
- Beautiful gradient effects and animations
- Mobile-friendly interface
- Loading states and error handling
- Form validation with helpful error messages
- Indian Rupees (₹) currency formatting throughout the app

## Tech Stack

- **React 19** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **Vite** - Fast build tool and dev server

## Project Structure

```
src/
├── components/
│   ├── Inputs/
│   │   ├── Input.jsx              # Reusable input component
│   │   └── ProfilePhotoSelector.jsx # Profile photo upload component
│   └── layouts/
│       ├── AuthLayout.jsx         # Layout for auth pages
│       ├── DashboardLayout.jsx    # Layout for dashboard pages
│       ├── Navbar.jsx             # Navigation bar
│       ├── SideMenu.jsx           # Side navigation menu
│       └── ProtectedRoute.jsx     # Route protection component
├── context/
│   ├── UserContext.js             # Context definition
│   └── UserContext.jsx            # User context provider
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx              # Login page
│   │   └── SignUp.jsx             # Registration page
│   └── Dashboard/
│       ├── Home.jsx               # Dashboard overview
│       ├── Income.jsx             # Income management
│       └── Expense.jsx            # Expense management
├── utils/
│   ├── apiPath.js                 # API endpoint definitions
│   ├── axiosInstance.js           # Axios configuration
│   ├── data.js                    # Static data (menu items)
│   └── helper.js                  # Utility functions (including INR formatting)
├── App.jsx                        # Main app component
└── main.jsx                       # App entry point
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd "Frontend/Expense Tracker"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Key Improvements Made

### 🔧 Bug Fixes
- Fixed syntax errors in SideMenu component
- Corrected missing imports and props in DashboardLayout
- Fixed CSS variable syntax error
- Resolved unused variable warnings

### ✨ New Features
- Added ProtectedRoute component for secure navigation
- Implemented comprehensive dashboard with statistics
- Created full CRUD functionality for income and expenses
- Added loading states and error handling
- Enhanced form validation with helper functions
- **Indian Rupees (₹) currency support throughout the application**

### 🎨 UI Enhancements
- Improved responsive design
- Added beautiful statistics cards
- Enhanced mobile navigation
- Better visual feedback for user actions
- **Indian Rupees formatting with proper number formatting (e.g., ₹1,00,000)**

### 🔒 Security Improvements
- Proper authentication flow with context
- Token validation on app startup
- Protected routes for authenticated users
- Secure logout functionality

## Currency Features

The application is specifically designed for Indian users with the following currency features:

- **Indian Rupees (₹)**: All monetary values are displayed in Indian Rupees
- **Indian Number Formatting**: Numbers are formatted according to Indian standards (e.g., ₹1,00,000 instead of ₹100,000)
- **Currency Symbols**: ₹ symbol is used consistently throughout the application
- **Form Labels**: Input fields are clearly labeled with ₹ symbol
- **Export Support**: Excel exports maintain Indian Rupees formatting

## API Integration

The frontend integrates with a Node.js/Express backend API with the following endpoints:

- **Authentication**: `/api/v1/auth/*`
- **Dashboard**: `/api/v1/dashboard`
- **Income**: `/api/v1/income/*`
- **Expense**: `/api/v1/expense/*`
- **Image Upload**: `/api/v1/auth/upload-image`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
