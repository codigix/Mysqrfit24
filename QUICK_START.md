# Quick Start - MySqrfit24 Backend & Frontend

Complete setup in just a few minutes!

## 📋 What's Been Created

✅ **Backend (Express + MySQL)**
- Complete REST API with 13+ endpoints
- User authentication with JWT
- Property management (CRUD)
- Chatbot inquiries management
- Error handling & middleware
- Database schema with 6 tables

✅ **Frontend Updates**
- API service client (`src/services/api.ts`)
- Updated hooks to use backend API
- Updated admin login page
- Environment configuration

✅ **Database Schema**
- Users table (authentication)
- Properties table (listings)
- Chatbot inquiries
- Images, reviews, and logs tables

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in project root)
npm install
```

### Step 2: Create `.env` File in Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and change these values:
```env
DB_PASSWORD=your_mysql_root_password
JWT_SECRET=your_secret_key_here
```

### Step 3: Initialize Database

```bash
cd backend
npm run init-db
```

This will create the database and all tables automatically.

### Step 4: Start Backend

```bash
npm run dev
```

You should see:
```
✓ Backend server running on http://localhost:5000
```

### Step 5: Start Frontend (New Terminal)

```bash
npm run dev
```

You should see:
```
  VITE v5.4.19  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

## ✨ That's It!

Now you can:
1. Open `http://localhost:5173/` in your browser
2. Go to `/admin/login`
3. Enter any email and password to create admin account
4. Manage properties in the admin panel

## 📁 Backend Structure

```
backend/
├── config/
│   ├── database.js      # MySQL connection pool
│   └── database.sql     # Database schema
├── controllers/
│   ├── authController.js       # Authentication logic
│   ├── propertyController.js   # Property CRUD
│   └── chatbotController.js    # Chatbot inquiries
├── middleware/
│   ├── auth.js          # JWT authentication
│   └── errorHandler.js  # Error handling
├── routes/
│   ├── authRoutes.js
│   ├── propertyRoutes.js
│   └── chatbotRoutes.js
├── server.js            # Express app setup
├── package.json
├── .env.example
└── README.md
```

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/register` | Create admin |
| GET | `/api/properties` | List properties |
| GET | `/api/properties/:id` | Get property |
| POST | `/api/properties` | Create property |
| PUT | `/api/properties/:id` | Update property |
| DELETE | `/api/properties/:id` | Delete property |
| POST | `/api/chatbot/inquiries` | Create inquiry |
| GET | `/api/chatbot/inquiries` | Get inquiries |
| DELETE | `/api/chatbot/inquiries/:id` | Delete inquiry |

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mysqrfit24_db
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend (Already configured in `.env.local`)
```env
VITE_API_URL=http://localhost:5000/api
```

## ❌ Troubleshooting

### "mysql: command not found"
You need MySQL installed. Download from: https://www.mysql.com/downloads/mysql/

### "Connection refused" error
```bash
# Windows: Make sure MySQL service is running
# Services app → Look for MySQL

# Mac: Using Homebrew
brew services start mysql

# Linux
sudo systemctl start mysql
```

### "Database already exists"
That's fine! The `init-db.js` script handles existing databases.

### "Port 5000 already in use"
Change PORT in `backend/.env`:
```env
PORT=5001
```

### Can't login to admin
1. Make sure backend is running: `http://localhost:5000/api/health`
2. Check backend console for errors
3. Try a new email/password

## 🎯 Next Steps

1. **Add sample data** - Create some properties in admin panel
2. **Customize** - Update your company name, logo, colors
3. **Image uploads** - Integrate cloud storage (AWS S3, Cloudinary, etc.)
4. **Email service** - Send notifications for inquiries
5. **Deploy** - Deploy to production server

## 📖 Full Documentation

For detailed setup instructions, see:
- **Backend**: `backend/README.md`
- **Full Setup**: `SETUP_GUIDE.md`

## 💾 Database Tables

| Table | Purpose |
|-------|---------|
| `users` | Admin accounts |
| `properties` | Property listings |
| `chatbot_inquiries` | Inquiry submissions |
| `property_images` | Property photos |
| `property_reviews` | Customer reviews |
| `admin_logs` | Activity logs |

## 🔐 Security Notes

- Change JWT_SECRET in production
- Use strong database passwords
- Enable HTTPS in production
- Don't commit `.env` files
- Implement rate limiting
- Validate all user inputs

## 📞 Support

Check the full SETUP_GUIDE.md for:
- Detailed configuration
- API documentation
- Troubleshooting guide
- Production deployment

---

**Happy coding! 🚀**
