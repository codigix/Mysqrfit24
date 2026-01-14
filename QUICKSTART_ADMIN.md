# Quick Start Guide - Admin Panel & Legal Content

## 🚀 What Was Built

A complete **Admin Panel System** with:
- ✅ Legal content management (Terms, Privacy Policy, About Us, etc.)
- ✅ File upload & management system
- ✅ Secure admin authentication (JWT)
- ✅ Public legal pages for end users
- ✅ Organized file storage (`/uploads` folder)

---

## 📋 System Requirements

1. **Node.js** v18+ (Already installed)
2. **MySQL** 8.0+ running locally on `localhost:3306`
3. **npm** or **bun** for package management

---

## 🔧 Setup Instructions

### Step 1: Configure Database Connection

**File**: `backend/.env`

Update these lines with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password    # ← Change this
DB_NAME=mysqrfit24_db
DB_PORT=3306
```

### Step 2: Initialize Database

```bash
cd backend
npm run init-db
```

This will create all necessary tables including:
- `legal_content` - Store legal documents
- `files` - Track uploads
- `site_settings` - Website configuration

### Step 3: Start Backend Server

```bash
npm start
```

You should see:
```
✓ Backend server running on http://localhost:5000
✓ Environment: development
✓ Database: mysqrfit24_db
```

### Step 4: Start Frontend (In New Terminal)

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 📍 Access Points

### Admin URLs
- **Admin Login**: http://localhost:5173/admin/login
- **Main Dashboard**: http://localhost:5173/admin
- **Legal Management**: http://localhost:5173/admin/legal

### Public URLs
- **Legal Pages**: http://localhost:5173/legal

---

## 👨‍💼 Create Admin Account

### First Time Setup

1. Visit: http://localhost:5173/admin/login
2. Click "Create Admin Account"
3. Enter email and password
4. First registered user becomes admin automatically

### Using API

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "is_admin": true
  }
}
```

---

## 📄 Managing Legal Content

### Add Terms & Conditions

1. Go to `/admin/legal`
2. Click "Add Legal Content"
3. Select "Terms & Conditions"
4. Enter title and content
5. Check "Publish Content"
6. Click "Create"

### View on Frontend

Visit `/legal` → See "Terms & Conditions" button
- Click to view published content
- Content updates automatically

### Supported Legal Documents

1. **Terms & Conditions**
2. **Privacy Policy**
3. **About Us**
4. **Disclaimer**
5. **Cookie Policy**

---

## 📁 File Upload Management

### Upload Documents

1. Go to `/admin/legal` → "Files & Documents" tab
2. Drag & drop or click to upload
3. Supported: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, ZIP (Max 50MB)

### File Storage Structure

```
backend/uploads/
├── documents/     (PDFs, Word docs, etc.)
└── images/        (JPG, PNG, GIF)
```

### Access Uploaded Files

```
http://localhost:5000/uploads/documents/filename.pdf
http://localhost:5000/uploads/images/photo.jpg
```

---

## 🔑 API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
```

### Legal Content (Admin Only)
```
GET    /api/legal               (Get all legal content)
GET    /api/legal/:id           (Get specific content)
POST   /api/legal               (Create - Admin)
PUT    /api/legal/:id           (Update - Admin)
DELETE /api/legal/:id           (Delete - Admin)
```

### File Upload (Admin Only)
```
POST   /api/files/upload        (Upload file - Admin)
GET    /api/files               (List files - Admin)
DELETE /api/files/:fileId       (Delete file - Admin)
```

---

## 🧪 Testing the System

### Test Health Check

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{"status":"ok","message":"Backend is running"}
```

### Test Legal Content Creation

```bash
# First, login to get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  | jq -r '.token')

# Create legal content
curl -X POST http://localhost:5000/api/legal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "terms_and_conditions",
    "title": "Terms & Conditions",
    "content": "Your terms here...",
    "is_published": true
  }'
```

### Test File Upload

```bash
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/document.pdf"
```

---

## 🎯 Common Tasks

### Update Legal Content
1. Go to `/admin/legal`
2. Find document you want to edit
3. Click edit icon
4. Modify content
5. Click "Update"

### Delete Legal Document
1. Go to `/admin/legal`
2. Find document
3. Click delete icon
4. Confirm deletion

### Manage Files
1. Go to `/admin/legal` → Files tab
2. Download: Click download icon
3. Delete: Click trash icon → Confirm

### Change Publishing Status
1. Go to `/admin/legal`
2. Click edit on legal content
3. Uncheck "Publish Content" to hide
4. Check to show to public

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check dependencies
cd backend
npm install

# Verify .env file
cat .env

# Try again
npm start
```

### Database Connection Error
```bash
# Check MySQL is running
# Verify credentials in .env
# Make sure database user exists
```

### Can't Upload Files
- Check `backend/uploads/` folder exists
- Verify file is under 50MB
- Ensure file type is allowed

### API Returns 401 Unauthorized
- Login again to get new token
- Check token is in Authorization header: `Bearer TOKEN`
- Verify token hasn't expired (7 days)

### Frontend Can't Reach Backend
- Ensure backend is running on port 5000
- Check CORS is enabled in `server.js`
- Verify URL in .env: `VITE_API_URL=http://localhost:5000/api`

---

## 📚 Documentation

For detailed information, see:
- **Admin Panel Guide**: `ADMIN_PANEL_GUIDE.md`
- **System Summary**: `ADMIN_SYSTEM_SUMMARY.md`
- **Database Schema**: `backend/config/database.sql`

---

## 🔒 Security Notes

- JWT tokens expire after 7 days (set in `.env`)
- Change `JWT_SECRET` in production
- Never commit `.env` file
- Use strong admin passwords
- Regular backups of `uploads/` folder

---

## 📦 New Files Created

### Backend
- `backend/controllers/legalController.js`
- `backend/controllers/fileController.js`
- `backend/routes/legalRoutes.js`
- `backend/routes/fileRoutes.js`
- `backend/utils/fileUpload.js`

### Frontend
- `src/pages/AdminLegal.tsx`
- `src/pages/Legal.tsx`

### Updated Files
- `backend/server.js`
- `backend/init-db.js`
- `src/App.tsx`
- `src/services/api.ts`
- `backend/config/database.sql`

---

## 🎓 Next Steps

1. ✅ Set up MySQL connection
2. ✅ Initialize database
3. ✅ Create admin account
4. ✅ Add legal documents
5. ✅ Upload files
6. ✅ Test public pages

---

## 💡 Tips

- **Backup Regularly**: Keep backups of `backend/uploads/` folder
- **Content Updates**: Changes appear instantly on frontend
- **File Organization**: Use descriptive filenames for easy management
- **Legal Documents**: Update annually or when laws change
- **Monitor Storage**: Check disk space for uploads folder

---

## 🆘 Need Help?

Check the browser console for frontend errors:
- Open DevTools: F12 or Ctrl+Shift+I
- Go to "Console" tab
- Look for red error messages

Check backend logs:
- Terminal where `npm start` is running
- Look for `ERROR` or `❌` messages

---

## ✨ Features Summary

| Feature | Location | Access |
|---------|----------|--------|
| Legal Content Management | `/admin/legal` | Admin Only |
| File Upload | `/admin/legal` (Files tab) | Admin Only |
| View Legal Content | `/legal` | Public |
| Admin Dashboard | `/admin` | Admin Only |
| Admin Login | `/admin/login` | Public |

---

**You're all set! Enjoy your new admin panel! 🎉**
