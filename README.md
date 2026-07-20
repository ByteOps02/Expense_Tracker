# Expense Tracker

Hi! This is a full-stack expense tracker app I built using the MERN stack (MongoDB, Express, React, Node.js). I made this to help keep track of incomes, expenses, and manage budgets easily.

## Features

- **User Authentication:** Login, sign up, and manage your profile (using JWT).
- **Dashboard:** A nice overview of your money with charts (using Chart.js).
- **Manage Transactions:** Add, edit, or delete your incomes and expenses.
- **Filter by Month:** See how much you spent or earned in any specific month.
- **Download Reports:** Export your transactions to an Excel sheet or generate PDF reports.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, Chart.js
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT for auth
- **Other:** Cloudinary for profile pictures, Multer for uploads

## How to run this locally

### 1. Clone the project
```bash
git clone https://github.com/ram02krishna/Expense_Tracker.git
cd Expense_Tracker
```

### 2. Set up the Backend
```bash
cd Backend
npm install
```
Create a `.env` file in the Backend folder with:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Then start the backend:
```bash
npm run dev
```

### 3. Set up the Frontend
Open a new terminal and go to the Frontend folder:
```bash
cd Frontend
npm install
```
Create a `.env` file in the Frontend folder with:
```env
VITE_BASE_URL=http://localhost:5000
```
Start the frontend:
```bash
npm run dev
```

Now open `http://localhost:5173` in your browser and you're good to go!