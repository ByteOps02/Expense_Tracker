# 💰 Expense Tracker

A full-stack web application for tracking personal income and expenses with a modern, responsive UI and comprehensive financial analytics.

## 🚀 Features

### Authentication & User Management
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Profile photo upload functionality
- Protected routes and middleware

### Financial Tracking
- **Income Management**: Add, edit, and delete income entries
- **Expense Management**: Track various expense categories
- **Data Export**: Export financial data to Excel format
- **Real-time Analytics**: Visual charts and statistics

### Dashboard & Analytics
- Interactive charts using Recharts
- Monthly/yearly financial summaries
- Category-wise expense breakdown
- Income vs Expense comparisons

### User Experience
- Modern, responsive UI with Tailwind CSS
- Toast notifications for user feedback
- Emoji picker for better categorization
- Mobile-friendly design

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **ExcelJS** - Excel file generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Chart library
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **Moment.js** - Date manipulation

## 📁 Project Structure

```
Expense_Tracker/
├── Backend/                 # Node.js/Express server
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads
│   └── server.js          # Main server file
├── Frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Expense_Tracker
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   ```

4. **Environment Configuration**

   Create a `.env` file in the Backend directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```

5. **Start the Application**

   **Backend (Terminal 1):**
   ```bash
   cd Backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd Frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile

### Expenses
- `GET /api/v1/expense` - Get all expenses
- `POST /api/v1/expense` - Create new expense
- `PUT /api/v1/expense/:id` - Update expense
- `DELETE /api/v1/expense/:id` - Delete expense
- `GET /api/v1/expense/export` - Export expenses to Excel

### Income
- `GET /api/v1/income` - Get all income entries
- `POST /api/v1/income` - Create new income entry
- `PUT /api/v1/income/:id` - Update income entry
- `DELETE /api/v1/income/:id` - Delete income entry
- `GET /api/v1/income/export` - Export income to Excel

### Dashboard
- `GET /api/v1/dashboard/summary` - Get financial summary
- `GET /api/v1/dashboard/charts` - Get chart data

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Key Features in Detail

### User Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Automatic token refresh

### Financial Management
- **Income Tracking**: Record various income sources with categories
- **Expense Tracking**: Log expenses with detailed categorization
- **Data Export**: Download financial data in Excel format
- **Search & Filter**: Find specific transactions easily

### Analytics Dashboard
- **Visual Charts**: Interactive pie charts and bar graphs
- **Monthly Trends**: Track spending patterns over time
- **Category Analysis**: Understand spending distribution
- **Financial Summary**: Quick overview of income vs expenses

### File Management
- **Profile Photos**: Upload and manage user profile pictures
- **Excel Export**: Generate detailed financial reports
- **Secure Storage**: Files stored with unique identifiers

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration for secure cross-origin requests
- Input validation and sanitization
- Protected API endpoints

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Ram Krishna**

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first styling
- MongoDB for the flexible database solution
- All open-source contributors whose libraries made this project possible

---

**Happy Expense Tracking! 💰📊** 