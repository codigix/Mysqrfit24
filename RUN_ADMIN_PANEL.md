# Running the Admin Panel - Step by Step

## Prerequisites

- Node.js 16+ installed
- MySQL running locally
- Main project dependencies installed

## Step-by-Step Instructions

### Step 1: Initialize Database

This creates all necessary tables including the new locations table:

```bash
cd backend
npm run init-db
```

Expected output:
```
✓ Database initialized successfully!
✓ Database: mysqrfit24_db
✓ Tables created:
  - users
  - properties
  - locations (NEW)
  - chatbot_inquiries
  ... and more
```

### Step 2: Start Backend Server

In a terminal window, start the backend:

```bash
cd backend
npm start
```

You should see:
```
✓ Backend server running on http://localhost:5000
✓ Environment: development
✓ Database: mysqrfit24_db
```

### Step 3: Install Admin Panel Dependencies

In a new terminal window:

```bash
cd admin-panel
npm install
```

### Step 4: Configure Admin Panel Environment

Create `.env` file in the `admin-panel` directory:

```
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PORT=5174
```

### Step 5: Start Admin Panel

```bash
cd admin-panel
npm run dev
```

You should see:
```
VITE v5.4.19  ready in 123 ms

➜  Local:   http://localhost:5174/
```

### Step 6: Access Admin Panel

Open your browser and go to: **http://localhost:5174**

## First Time Setup

### Create Admin Account

You'll need to create an admin account. Use curl or Postman:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_secure_password"
  }'
```

### Login to Admin Panel

1. Navigate to `http://localhost:5174/login`
2. Enter your admin credentials
3. Click "Login"
4. You'll be redirected to the dashboard

## Running Both Concurrently (Terminal Layout)

It's best to run both in separate terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Admin Panel:**
```bash
cd admin-panel
npm run dev
```

**Terminal 3 (Optional) - Main Frontend:**
```bash
# Back in root directory
npm run dev
```

Now you have:
- Backend: http://localhost:5000
- Admin Panel: http://localhost:5174
- Main App: http://localhost:5173

## Checking Everything is Working

### Backend Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### Admin Panel Accessibility

1. Go to http://localhost:5174
2. You should see the login page
3. Login with your admin credentials
4. You should see the admin dashboard

## Using the Admin Panel

### Add a Location (Example)

1. Login to admin panel
2. Click on "Locations" in the sidebar
3. Click "Add Location" button
4. Fill in:
   - Name: "Downtown Area"
   - Description: "Heart of the city"
   - Latitude: 28.6139
   - Longitude: 77.2090
5. Click "Create"

### Add a Property (Example)

1. Click on "Properties" in the sidebar
2. Click "Add Property" button
3. Fill in:
   - Title: "Modern 2BHK Apartment"
   - Location: "Downtown Area"
   - Price: "50000"
   - Type: "Rent"
   - Description: "Beautiful apartment with modern amenities"
4. Click "Create"

### Upload Images

1. Click on "Images" in the sidebar
2. Drag and drop images or click to select
3. Images are stored in `backend/uploads/images/`
4. View the uploaded image preview

### Manage Users

1. Click on "Users" in the sidebar
2. View all registered users
3. Edit user roles and information
4. Delete users if needed

### Create Blog Posts

1. Click on "Blog" in the sidebar
2. Click "New Post" button
3. Write your post with title, content, author
4. Choose status: Draft or Published
5. Click "Create"

### Configure Site Settings

1. Click on "Settings" in the sidebar
2. Edit any setting value
3. Click "Save"
4. Changes take effect immediately

### View Inquiries

1. Click on "Inquiries" in the sidebar
2. Switch between:
   - **Chatbot Inquiries**: Property search requests
   - **Contact Messages**: General contact form submissions
3. Click to expand and view full messages

## Troubleshooting

### "Cannot connect to API"

**Solution:**
- Verify backend is running on port 5000
- Check `.env` has correct `VITE_API_URL`
- Verify CORS is enabled in backend

### "Login failed" Error

**Solution:**
- Create admin account using curl command above
- Check database connection
- Verify JWT_SECRET is set in backend/.env

### "Module not found" Error

**Solution:**
```bash
# In admin-panel directory
rm -rf node_modules package-lock.json
npm install
```

### Images not uploading

**Solution:**
1. Check backend/uploads folder exists
2. Verify folder permissions
3. Check file size (max 50MB)
4. Check console for error messages

### Database connection error

**Solution:**
1. Ensure MySQL is running
2. Check backend/.env credentials
3. Run `npm run init-db` again
4. Check MySQL user permissions

## File Storage

Images and files are stored at:
- Backend: `backend/uploads/`
- Public URL: `http://localhost:5000/uploads/...`

## Next Steps

1. **Add Content**: Start adding properties, locations, and blog posts
2. **Customize**: Update site settings with your branding
3. **Create Users**: Add team members to manage content
4. **Publish**: Mark blog posts and content as published
5. **Monitor**: Check inquiries and messages from visitors

## Production Deployment

When ready to deploy:

```bash
# Build admin panel
cd admin-panel
npm run build

# Deploy dist folder to your server
```

## Getting Help

If you encounter issues:

1. Check the console for error messages
2. Review the README in admin-panel folder
3. Check backend logs
4. Verify all services are running
5. Check environment variables

## Database Backup

Before making major changes, backup your database:

```bash
mysqldump -u root -p mysqrfit24_db > backup.sql
```

## Summary

You now have:
- ✅ Complete admin panel at http://localhost:5174
- ✅ Backend API at http://localhost:5000
- ✅ Ability to manage all platform content
- ✅ Image and file upload capabilities
- ✅ User and settings management
- ✅ Inquiry and message tracking

Enjoy managing your platform!
