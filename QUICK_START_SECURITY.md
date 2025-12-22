# Quick Start Guide - Security Configuration

## ⚡ Quick Setup (5 minutes)

### 1. Backend Setup
```bash
cd Backend

# Copy environment template
cp .env.example .env

# Edit .env with your actual values
# See Backend/.env.example for all required variables
nano .env  # or use your preferred editor

# Install dependencies (already done, but just in case)
npm install --legacy-peer-deps

# Run in development
npm run dev
```

### 2. Frontend Setup
```bash
cd Frontend

# Copy environment template
cp .env.example .env

# Edit .env with backend API URL
nano .env

# Install dependencies
npm install

# Run development server
npm run dev
```

## 📋 Environment Variables Checklist

### Backend (.env)
- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- [ ] `SESSION_SECRET` - Generate with: `openssl rand -base64 32`
- [ ] `CLIENT_URL` - Frontend URL (http://localhost:5173 for dev)
- [ ] `CLOUDINARY_*` - Your Cloudinary credentials

### Frontend (.env)
- [ ] `VITE_BASE_URL` - Backend API URL (http://localhost:5000 for dev)

## 🔒 Security Features Enabled

✅ **CSRF Protection** - Helmet middleware + SameSite cookies
✅ **Rate Limiting** - Prevents brute force attacks
✅ **Input Validation** - Prevents injection attacks
✅ **Secure Sessions** - httpOnly, secure, SameSite flags
✅ **Security Headers** - CSP, X-Frame-Options, and more
✅ **Password Security** - Bcrypt hashing with validation

## 🧪 Quick Security Test

```bash
# Test rate limiting (6th request should fail)
for i in {1..6}; do 
  curl -X POST http://localhost:5000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}'
done
```

## 📚 Full Documentation
- See `SECURITY.md` for detailed security policy
- See `SECURITY_FIXES_SUMMARY.md` for all fixes implemented
- See `.env.example` files for variable descriptions

## 🚀 Ready for Development?
Your application now has production-grade security! Start developing with confidence.

For production deployment, review the checklist in `SECURITY_FIXES_SUMMARY.md`
