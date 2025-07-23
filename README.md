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

- 🔐 **Authentication:** JWT-based, secure registration & login, profile photo upload
- 📊 **Dashboard:** Real-time financial statistics, recent transactions
- 💰 **Income/Expense Management:** Add, view, delete, and export to Excel
- 📱 **Responsive Design:** Mobile-friendly, modern UI with Tailwind CSS
- 🛡️ **Security:** Password hashing, protected routes, input validation
- ⚡ **Fast & Modern:** Built with Vite, React 19, and Express.js

---

## 🚀 Demo

<!-- Uncomment and add your demo link or GIF/screenshots here -->
<!-- [Live Demo](https://your-demo-link.com) -->
<!-- ![Demo GIF](demo.gif) -->

---

## 🛠️ Tech Stack

**Frontend:**  
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white) ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)  
React Router DOM, Axios, Recharts, React Hot Toast

**Backend:**  
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white)  
Mongoose, JWT, Multer, ExcelJS, bcryptjs

---

## 📦 Node Modules & Their Purpose

### Backend
| Module        | Purpose                                                               |
|---------------|------------------------------------------------------------------------|
| bcryptjs      | Hashes user passwords securely before storing in the database          |
| cors          | Enables Cross-Origin Resource Sharing for API requests                 |
| dotenv        | Loads environment variables from a .env file                           |
| exceljs       | Generates and manipulates Excel files for data export                  |
| express       | Web framework for building RESTful APIs                                |
| jsonwebtoken  | Implements JWT-based authentication and authorization                  |
| mongoose      | ODM for MongoDB, manages data models and queries                       |
| multer        | Handles file uploads (e.g., profile photos)                            |
| nodemon       | Automatically restarts the server on code changes (development only)   |
| eslint        | Lints and enforces code style (development only)                       |

### Frontend
| Module                  | Purpose                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| react                   | Core library for building user interfaces                               |
| react-dom               | DOM bindings for React                                                  |
| tailwindcss             | Utility-first CSS framework for rapid UI development                    |
| @tailwindcss/vite       | Integrates Tailwind CSS with Vite build tool                            |
| vite                    | Fast build tool and development server                                  |
| @vitejs/plugin-react    | Vite plugin for React support                                           |
| @types/react            | TypeScript type definitions for React (development only)                |
| @types/react-dom        | TypeScript type definitions for React DOM (development only)            |
| eslint                  | Lints and enforces code style (development only)                        |
| @eslint/js              | ESLint configuration for JavaScript (development only)                  |
| eslint-plugin-react-hooks| ESLint rules for React hooks (development only)                        |
| eslint-plugin-react-refresh| ESLint rules for React Fast Refresh (development only)               |
| globals                 | Provides global variables for ESLint (development only)                 |

---

## 📦 Folder Structure

```