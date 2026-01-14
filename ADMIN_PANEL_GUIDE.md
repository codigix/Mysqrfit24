# Admin Panel Guide - Complete System

## Overview

The admin panel now includes comprehensive features for managing all legal content, file uploads, and site settings. This guide explains how to use each feature.

---

## System Architecture

### Backend (Node.js + Express)
- **Authentication**: JWT-based admin login system
- **Database**: MySQL with 14 tables
- **File Storage**: Local file system with `/uploads` folder
- **API Routes**: RESTful endpoints for all resources

### Frontend (React + TypeScript)
- **Admin Pages**: Protected routes for authenticated admins
- **Public Pages**: Legal content pages visible to all users
- **File Management**: Upload and manage documents

---

## Database Tables

### New Tables Added

#### 1. **legal_content**
Stores legal documents like Terms & Conditions, Privacy Policy, etc.

```sql
Fields:
- id: Unique identifier
- type: Enum (terms_and_conditions, privacy_policy, about_us, disclaimer, cookie_policy)
- title: Document title
- content: Full document content
- is_published: Boolean for visibility
- updated_by: Admin user ID
- created_at, updated_at: Timestamps
```

#### 2. **site_settings**
Stores general site configuration and settings.

```sql
Fields:
- id: Unique identifier
- setting_key: Setting name (unique)
- setting_value: Configuration value
- setting_type: Enum (text, number, boolean, json)
- description: Setting description
- updated_by: Admin user ID
- created_at, updated_at: Timestamps
```

#### 3. **files**
Tracks uploaded files and documents.

```sql
Fields:
- id: Unique identifier
- original_filename: User-provided filename
- stored_filename: System filename with UUID
- file_path: Path in uploads directory
- file_size: File size in bytes
- file_type: File extension
- mime_type: MIME type
- uploaded_by: Admin user ID
- created_at: Upload timestamp
```

---

## Admin Panel Features

### 1. Login Page
**URL**: `/admin/login`

- Enter admin email and password
- JWT token stored in localStorage
- Token required for all admin operations

### 2. Main Admin Dashboard
**URL**: `/admin`

**Features**:
- **Properties Management**: Add, edit, delete properties
- **Chatbot Inquiries**: View and manage customer inquiries
- **Contact Messages**: View and respond to contact form submissions

### 3. Legal & Settings Management
**URL**: `/admin/legal`

#### Tab 1: Legal Content
Manage all legal documents displayed on the frontend.

**Available Legal Documents**:
1. **Terms & Conditions**
2. **Privacy Policy**
3. **About Us**
4. **Disclaimer**
5. **Cookie Policy**

**Actions**:
- **View All**: See all created legal documents with their status
- **Create New**: Click "Add Legal Content" button
  - Select document type
  - Enter title
  - Write content in the text area
  - Toggle "Publish Content" to make it visible to users
  - Save and it will appear on the frontend

- **Edit**: Click the edit icon to modify existing content
- **Delete**: Remove documents (cannot be undone)

#### Tab 2: File Management
Upload and manage documents for the website.

**Supported File Types**:
- Documents: PDF, DOC, DOCX, TXT
- Images: JPG, JPEG, PNG, GIF
- Archives: ZIP
- Maximum file size: 50MB

**Actions**:
- **Upload**: Drag and drop or click to upload files
- **Download**: Click the download icon to get file
- **Delete**: Remove uploaded files

**File Storage**:
- Documents stored in: `backend/uploads/documents/`
- Images stored in: `backend/uploads/images/`
- Files accessible via: `http://localhost:5000/uploads/...`

---

## Frontend Public Pages

### Legal Content Display
**URL**: `/legal`

**Features**:
- Navigation buttons for all 5 legal document types
- Display selected document content
- Only shows published documents
- Responsive design

**How it Works**:
1. User visits `/legal` page
2. Can switch between different legal documents
3. Content is fetched from API in real-time
4. Updates automatically when admin changes content

---

## API Endpoints

### Legal Content Endpoints

```
GET    /api/legal                    - Get all legal content
GET    /api/legal/:id                - Get specific content
POST   /api/legal                    - Create new legal content (Admin)
PUT    /api/legal/:id                - Update legal content (Admin)
DELETE /api/legal/:id                - Delete legal content (Admin)
```

### File Upload Endpoints

```
POST   /api/files/upload             - Upload file (Admin)
GET    /api/files                    - List all files (Admin)
DELETE /api/files/:fileId            - Delete file (Admin)
```

---

## How to Use - Step by Step

### Create Terms & Conditions

1. Navigate to `/admin/legal`
2. Click "Add Legal Content"
3. Select "Terms & Conditions" from dropdown
4. Enter title: "Terms & Conditions"
5. Paste your terms content in the text area
6. Check "Publish Content" if ready to show to users
7. Click "Create"
8. Document appears immediately on `/legal` page

### Update Legal Document

1. Go to `/admin/legal`
2. Find the document you want to edit
3. Click the edit (pencil) icon
4. Modify the content as needed
5. Click "Update"
6. Changes appear instantly on public pages

### Upload Company Document

1. Go to `/admin/legal` → "Files & Documents" tab
2. Click in the upload area or drag and drop a file
3. Wait for upload to complete
4. File appears in the list with download/delete options
5. You can share the file URL with clients

### Delete Legal Content

1. Go to `/admin/legal`
2. Find the document to delete
3. Click the trash (delete) icon
4. Confirm deletion in the dialog
5. Document is removed permanently

---

## File Structure

```
backend/
├── controllers/
│   ├── legalController.js      (Manage legal content)
│   └── fileController.js        (Manage file uploads)
├── routes/
│   ├── legalRoutes.js           (Legal content routes)
│   └── fileRoutes.js            (File upload routes)
├── utils/
│   └── fileUpload.js            (File handling utilities)
├── uploads/                     (File storage)
│   ├── documents/               (PDFs, DOCs, etc.)
│   └── images/                  (JPG, PNG, etc.)
└── config/
    └── database.sql             (Updated schema)

src/
├── pages/
│   ├── AdminLegal.tsx           (Admin management page)
│   └── Legal.tsx                (Public legal pages)
└── services/
    └── api.ts                   (Updated with new endpoints)
```

---

## Security Features

1. **JWT Authentication**: All admin endpoints require valid JWT token
2. **Admin-Only Access**: File uploads and legal content creation require admin role
3. **Input Validation**: All inputs validated on backend
4. **File Type Restrictions**: Only allowed file types can be uploaded
5. **File Size Limits**: Maximum 50MB per file
6. **SQL Injection Protection**: Using parameterized queries

---

## Troubleshooting

### Backend Won't Start
```bash
# Make sure dependencies are installed
cd backend
npm install

# Check .env file has correct database credentials
# Then start:
npm start
```

### Database Not Initializing
```bash
# Ensure MySQL is running locally
# Update .env with correct credentials
# Run:
npm run init-db
```

### Files Not Uploading
1. Check uploads folder exists: `backend/uploads/`
2. Verify permissions on uploads folder
3. Check file size is under 50MB
4. Ensure file type is in allowed list

### API Endpoints Not Working
1. Verify backend is running: `npm start`
2. Check token is valid: Login again
3. Verify you're using correct endpoint paths
4. Check CORS is enabled in server.js

---

## Default Admin Account

To create an admin account, use the registration endpoint:

```bash
POST /api/auth/register
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

First registered user becomes admin.

---

## Environment Variables

Required in `backend/.env`:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mysqrfit24_db
DB_PORT=3306
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

---

## Performance Tips

1. **Compress Images**: Reduce image file size before upload
2. **Use CDN**: For frequently accessed files
3. **Regular Backups**: Backup uploads folder regularly
4. **Clean Old Files**: Delete unused documents periodically
5. **Monitor Database**: Keep legal_content clean

---

## Future Enhancements

Potential features to add:
- Email notifications for new inquiries
- Document versioning/history
- Bulk file operations
- Advanced search and filtering
- Analytics dashboard
- Multi-language support
- Document scheduling (auto-publish)

---

## Support & Maintenance

For issues or questions:
1. Check this guide first
2. Review API endpoint documentation
3. Check browser console for errors
4. Review backend logs
5. Verify database connectivity

**Backend Logs**: Check terminal where `npm start` is running

**Frontend Logs**: Open browser DevTools → Console tab
