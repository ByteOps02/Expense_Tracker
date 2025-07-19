# Expense Tracker

A full-stack web application for tracking personal income and expenses with a modern, responsive UI. Built with React frontend and Node.js/Express backend.

## 🚀 Features

### 🔐 Authentication
- User registration with profile photo upload
- Secure login/logout functionality
- JWT token-based authentication
- Protected routes for authenticated users

### 📊 Dashboard
- Overview of financial statistics
- Total balance, income, and expense tracking
- Recent transactions display
- Responsive design with modern UI

### 💰 Income Management
- Add new income entries with categories
- View income history
- Delete income records
- Export income data to Excel

### 💸 Expense Management
- Add new expense entries with categories
- View expense history
- Delete expense records
- Export expense data to Excel

### 🎨 UI/UX Features
- Modern, responsive design using Tailwind CSS
- Beautiful gradient effects and animations
- Mobile-friendly interface
- Loading states and error handling
- Form validation with helpful error messages

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **Vite** - Fast build tool and dev server
- **React Hot Toast** - Toast notifications
- **Recharts** - Data visualization
- **Moment.js** - Date handling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **ExcelJS** - Excel file generation
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Expense_Tracker/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Cards/
│   │   │   ├── Inputs/
│   │   │   └── layouts/
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   │   ├── Auth/
│   │   │   └── Dashboard/
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # App entry point
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
├── Backend/                  # Node.js backend application
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── uploads/              # File upload directory
│   ├── package.json          # Backend dependencies
│   └── server.js             # Server entry point
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Expense_Tracker
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the Backend directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your_jwt_secret_key_here
   ```

5. **Start the Backend Server**
   ```bash
   cd Backend
   npm start
   ```
   The backend will run on `http://localhost:8000`

6. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/getUser` - Get user information
- `POST /api/v1/auth/upload-image` - Upload profile image

### Dashboard Endpoints
- `GET /api/v1/dashboard` - Get dashboard statistics

### Income Endpoints
- `POST /api/v1/income/add` - Add new income
- `GET /api/v1/income/get` - Get all income records
- `DELETE /api/v1/income/:id` - Delete income record
- `GET /api/v1/income/downloadexcel` - Export income to Excel

### Expense Endpoints
- `POST /api/v1/expense/add` - Add new expense
- `GET /api/v1/expense/get` - Get all expense records
- `DELETE /api/v1/expense/:id` - Delete expense record
- `GET /api/v1/expense/downloadexcel` - Export expense to Excel

## 🔧 Development

### Available Scripts

#### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

#### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Code Structure

#### Frontend Components
- **AuthLayout**: Beautiful split-screen layout for authentication pages
- **DashboardLayout**: Main application layout with sidebar navigation
- **Navbar**: Top navigation with mobile menu support
- **SideMenu**: Responsive sidebar with user profile and navigation
- **Input**: Reusable input component with password toggle
- **ProfilePhotoSelector**: Image upload component with preview

#### Backend Architecture
- **Controllers**: Handle business logic for each route
- **Models**: MongoDB schemas for data validation
- **Middleware**: Authentication and file upload handling
- **Routes**: API endpoint definitions
- **Config**: Database and server configuration

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Purple and violet gradients with modern aesthetics
- **Typography**: Poppins font family for clean readability
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

### Components
- **Statistics Cards**: Beautiful cards displaying financial data
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Skeleton loaders and loading spinners
- **Toast Notifications**: User feedback for actions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Protected Routes**: Client and server-side route protection
- **Input Validation**: Comprehensive form validation
- **CORS Configuration**: Secure cross-origin requests

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1024px and above)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Frontend Deployment
1. Build the application:
   ```bash
   cd Frontend
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Deploy the Backend folder to your server
3. Ensure MongoDB connection is configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite for the fast build tool
- MongoDB for the database solution
- Express.js for the web framework

## 📞 Support

If you have any questions or need help, please open an issue in the repository or contact the development team.

---

**Happy Coding! 🎉** 