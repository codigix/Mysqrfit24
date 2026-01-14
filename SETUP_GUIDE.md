# MySqrfit24 - Complete Setup Guide

This guide will help you set up both the frontend and backend for the MySqrfit24 real estate platform.

## Project Structure

```
Mysqrfit24/
├── src/                    # Frontend (React + TypeScript)
├── backend/                # Backend (Express + MySQL)
├── .env.local             # Frontend environment variables
├── package.json           # Frontend dependencies
└── SETUP_GUIDE.md         # This file
```

## Prerequisites

Before starting, ensure you have installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL Server** (v5.7 or higher) - [Download](https://www.mysql.com/downloads/mysql/)
- **npm** or **yarn** (comes with Node.js)

## Step 1: Database Setup

### 1.1 Create Database and Tables

Open MySQL command line or MySQL Workbench and execute:

```sql
-- Copy-paste entire content of backend/config/database.sql
```

Or use command line:
```bash
cd backend
mysql -u root -p < config/database.sql
```

When prompted, enter your MySQL root password.

### 1.2 Verify Database Creation

```bash
mysql -u root -p
```

Then in MySQL prompt:
```sql
USE mysqrfit24_db;
SHOW TABLES;
```

You should see these tables:
- `users`
- `properties`
- `chatbot_inquiries`
- `property_images`
- `property_reviews`
- `admin_logs`

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and update:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password    # <-- Change this
DB_NAME=mysqrfit24_db
DB_PORT=3306

JWT_SECRET=your_super_secret_key_change_in_production    # <-- Change this
JWT_EXPIRE=7d

ADMIN_EMAIL=admin@mysqrfit24.com
ADMIN_PASSWORD=Admin@123

CLIENT_URL=http://localhost:5173
```

### 2.3 Start Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✓ Backend server running on http://localhost:5000
✓ Environment: development
✓ Database: mysqrfit24_db
```

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
npm install
```

### 3.2 Frontend is Already Configured

The `.env.local` file is already configured to connect to your backend:

```env
VITE_API_URL=http://localhost:5000/api
```

If you changed the backend port, update this value.

### 3.3 Start Frontend Dev Server

Open a **new terminal** and run:

```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## Step 4: Create Admin Account

1. Open your browser and go to: `http://localhost:5173/admin/login`

2. Click on the login form and enter:
   - Email: `admin@mysqrfit24.com` (or any email)
   - Password: `Admin@123` (or any password)

3. The backend will automatically create the account if it doesn't exist

4. You'll be redirected to the admin dashboard

## Step 5: Test the Setup

### Test Backend Endpoints

Open a terminal and test the API:

```bash
# Check health
curl http://localhost:5000/api/health

# Get all properties
curl http://localhost:5000/api/properties

# Get properties with filters
curl "http://localhost:5000/api/properties?type=sale&location=New York"
```

### Test Frontend

- Navigate to `http://localhost:5173`
- View properties list
- Click on properties to see details
- Go to `/admin/login` to access admin panel
- Create, edit, and delete properties

## Available Features

### Public Pages
- `/` - Home page with featured properties
- `/properties` - Browse all properties with filters
- `/property/:id` - Property details
- `/about` - About page

### Admin Features (Protected)
- `/admin/login` - Admin login/register
- `/admin` - Admin dashboard
  - Create properties
  - Edit properties
  - Delete properties
  - View chatbot inquiries
  - Manage property images

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin account

### Property Endpoints
- `GET /api/properties` - List all properties
  - Query params: `type`, `property_type`, `location`, `min_price`, `max_price`, `bedrooms`, `bathrooms`
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (admin only)
- `PUT /api/properties/:id` - Update property (admin only)
- `DELETE /api/properties/:id` - Delete property (admin only)

### Chatbot Endpoints
- `POST /api/chatbot/inquiries` - Create inquiry
- `GET /api/chatbot/inquiries` - Get all inquiries (admin only)
- `DELETE /api/chatbot/inquiries/:id` - Delete inquiry (admin only)

## Troubleshooting

### Backend won't start - "Cannot find module"
```bash
cd backend
npm install
```

### Database connection error
- Check MySQL is running
- Verify credentials in `.env`
- Run: `mysql -u root -p` to test connection
- Ensure `mysqrfit24_db` database exists

### "Port 5000 already in use"
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :5000
kill -9 <PID>
```

Or change port in `.env`:
```env
PORT=5001
```

### CORS errors in browser console
- Make sure backend URL in `.env.local` is correct
- Ensure both servers are running
- Check firewall settings

### Admin login not working
- Verify backend is running at `http://localhost:5000/api/health`
- Check credentials in backend `.env`
- Look for errors in backend console

## Running Tests

### Frontend
```bash
npm run lint
```

### Backend
```bash
cd backend
npm test
```

## Building for Production

### Frontend
```bash
npm run build
npm run preview
```

### Backend
Change `.env`:
```env
NODE_ENV=production
JWT_SECRET=your_actual_secret_key
```

Then:
```bash
npm start
```

## Next Steps

1. **Customize branding** - Update company name, logo, colors
2. **Add image upload** - Configure cloud storage (AWS S3, Cloudinary, etc.)
3. **Email notifications** - Set up email service for inquiries
4. **Analytics** - Integrate analytics service
5. **Deploy** - Deploy to production server

## Support

For issues or questions:
1. Check the error message in console
2. Review backend logs: `http://localhost:5000/api/health`
3. Check frontend network tab in DevTools
4. Verify all services are running

## Files Modified for Backend Integration

- `src/services/api.ts` - API service client
- `src/hooks/useProperties.ts` - Updated to use backend API
- `src/pages/AdminLogin.tsx` - Updated authentication
- `.env.local` - Frontend API URL configuration

## Quick Start Commands

```bash
# Terminal 1 - Start Backend
cd backend
npm install
npm run dev

# Terminal 2 - Start Frontend
npm install
npm run dev
```

Then open: `http://localhost:5173`
