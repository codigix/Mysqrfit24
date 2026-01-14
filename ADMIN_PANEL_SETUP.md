# Complete Admin Panel Setup Guide

## Overview

A fully functional, dedicated admin panel has been created in the `/admin-panel` directory. It provides comprehensive management of all platform data including properties, locations, images, users, blog posts, site settings, and customer inquiries.

## Quick Start

### 1. Install Dependencies

```bash
cd admin-panel
npm install
```

### 2. Configure Environment

Create a `.env` file in the admin-panel directory:

```
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PORT=5174
```

### 3. Start the Admin Panel

```bash
npm run dev
```

The admin panel will be available at: **http://localhost:5174**

### 4. Initialize Database

Before using the admin panel, update the database with new tables:

```bash
cd backend
npm run init-db
```

## Project Structure

```
admin-panel/
├── src/
│   ├── components/
│   │   ├── admin/                    # Admin management components
│   │   │   ├── PropertiesManagement.tsx
│   │   │   ├── LocationsManagement.tsx
│   │   │   ├── ImagesManagement.tsx
│   │   │   ├── UsersManagement.tsx
│   │   │   ├── BlogManagement.tsx
│   │   │   ├── SettingsManagement.tsx
│   │   │   └── InquiriesManagement.tsx
│   │   └── ui/                       # Reusable UI components
│   ├── pages/
│   │   ├── Login.tsx                 # Admin login
│   │   └── AdminDashboard.tsx        # Main dashboard
│   ├── hooks/
│   │   └── useAuth.ts               # Authentication hook
│   ├── services/
│   │   └── api.ts                   # API client
│   ├── types/
│   │   └── index.ts                 # TypeScript types
│   ├── lib/
│   │   └── utils.ts                 # Utilities
│   ├── App.tsx                       # App component
│   └── main.tsx                      # Entry point
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Features

### 1. Properties Management
- **Create**: Add new properties with all details (price, location, features, images)
- **Edit**: Update existing property information
- **Delete**: Remove properties from the listing
- **Fields**: Title, description, price, type (sale/rent), location, address, bedrooms, bathrooms, area, developer info

### 2. Locations/Regions
- **Create**: Add new locations with coordinates
- **Edit**: Update location details and map coordinates
- **Delete**: Remove locations
- **Coordinates**: Store latitude and longitude for map integration
- **Grid View**: Visual display of all locations

### 3. Images & Media
- **Upload**: Drag-and-drop or click to upload images
- **Preview**: Thumbnail preview of uploaded images
- **Download**: Download uploaded files
- **Delete**: Remove files from storage
- **Supported Formats**: Images (JPG, PNG, GIF), Documents (PDF, DOC, DOCX)

### 4. Users Management
- **View Users**: List all registered users
- **User Details**: Email, name, role, registration date
- **Edit User**: Update user information and role
- **Delete User**: Remove user accounts
- **Roles**: Admin or regular user

### 5. Blog Management
- **Create Posts**: Write and publish blog articles
- **Edit Posts**: Update existing blog posts
- **Delete Posts**: Remove blog posts
- **Auto-slug**: Automatic URL slug generation
- **Status**: Draft or Published
- **Fields**: Title, content, excerpt, author, category, status

### 6. Site Settings
- **Global Configuration**: Manage site-wide settings
- **Setting Types**: Text, number, boolean, JSON
- **Quick Edit**: Edit settings inline
- **Descriptions**: Each setting has a description for clarity

### 7. Inquiries & Messages
- **Chatbot Inquiries**: View property inquiries from the chatbot
- **Contact Messages**: View contact form submissions
- **Expandable Details**: Click to see full message content
- **Message Status**: New, read, or replied status tracking

## Authentication

### Login
1. Navigate to `/login`
2. Enter admin email and password
3. Token stored in localStorage automatically
4. All subsequent API calls include the auth token

### Default Admin Account
To create your first admin account, use the auth registration endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_secure_password"
  }'
```

The first registered user becomes an admin automatically.

## Backend API Endpoints

### Properties
```
GET    /api/properties          - Get all properties
GET    /api/properties/:id      - Get property details
POST   /api/properties          - Create property (admin)
PUT    /api/properties/:id      - Update property (admin)
DELETE /api/properties/:id      - Delete property (admin)
```

### Locations
```
GET    /api/locations           - Get all locations
GET    /api/locations/:id       - Get location details
POST   /api/locations           - Create location (admin)
PUT    /api/locations/:id       - Update location (admin)
DELETE /api/locations/:id       - Delete location (admin)
```

### Users
```
GET    /api/users               - Get all users (admin)
GET    /api/users/:id           - Get user details (admin)
PUT    /api/users/:id           - Update user (admin)
DELETE /api/users/:id           - Delete user (admin)
```

### Blog
```
GET    /api/blog                - Get all posts
GET    /api/blog/:id            - Get post details
POST   /api/blog                - Create post (admin)
PUT    /api/blog/:id            - Update post (admin)
DELETE /api/blog/:id            - Delete post (admin)
```

### Settings
```
GET    /api/settings            - Get all settings (admin)
GET    /api/settings/:key       - Get setting details (admin)
POST   /api/settings            - Create setting (admin)
PUT    /api/settings/:key       - Update setting (admin)
DELETE /api/settings/:key       - Delete setting (admin)
```

### Files
```
GET    /api/files               - Get all files (admin)
POST   /api/files/upload        - Upload file (admin)
DELETE /api/files/:fileId       - Delete file (admin)
```

### Inquiries
```
GET    /api/chatbot/inquiries   - Get inquiries (admin)
GET    /api/contact             - Get messages (admin)
```

## Database Tables

### New Tables Created

#### locations
- `id`: Unique identifier
- `name`: Location name
- `description`: Location description
- `image_url`: Location image
- `lat`: Latitude
- `lng`: Longitude
- `created_at`, `updated_at`: Timestamps

#### Updated users Table
- Added `name` field
- Added `role` field (enum: 'admin', 'user')

## Build & Deployment

### Build for Production

```bash
npm run build
```

Output files will be in the `dist/` directory.

### Serve Production Build

```bash
npm run preview
```

## Styling & Design

- **Framework**: Tailwind CSS
- **UI Library**: ShadCN UI / Radix UI
- **Icons**: Lucide React
- **Color Scheme**: Professional blue/slate theme
- **Responsive**: Mobile-friendly admin interface

## Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Admin-Only Routes**: Protected routes require admin role
3. **Authorization**: All admin endpoints verify user role
4. **Input Validation**: Backend validates all inputs
5. **SQL Injection Protection**: Parameterized queries
6. **CORS**: Configured for secure cross-origin requests

## Troubleshooting

### Backend Connection Error

If you see "Failed to connect to API", ensure:
1. Backend server is running: `npm start` in the backend folder
2. API URL is correct in `.env`: `VITE_API_URL=http://localhost:5000/api`
3. CORS is enabled in `backend/server.js`

### Database Tables Missing

If tables aren't found, run initialization:

```bash
cd backend
npm run init-db
```

### Login Failed

1. Verify admin account exists
2. Check database connection
3. Ensure JWT_SECRET is set in backend `.env`
4. Check browser console for detailed errors

### File Upload Not Working

1. Verify `backend/uploads/` folder exists
2. Check folder permissions (readable/writable)
3. Verify file size is under 50MB
4. Check file extension is allowed

## Development Tips

### Hot Reload
The development server supports hot module replacement. Changes to files will automatically reload the browser.

### TypeScript
All components are TypeScript-enabled. Type definitions are in `src/types/index.ts`.

### API Service
All API calls go through `src/services/api.ts`. Add new endpoints there and they'll be automatically typed.

### Adding New Components
1. Create component in `src/components/admin/`
2. Add route in `AdminDashboard.tsx`
3. Import and add to tab list
4. Update API service if needed

## Performance Optimization

1. **Images**: Compress images before upload
2. **Pagination**: Implement for large datasets (future enhancement)
3. **Caching**: Use browser caching for frequently accessed data
4. **Code Splitting**: Vite automatically handles code splitting

## Future Enhancements

- [ ] Email notifications for new inquiries
- [ ] Bulk operations (import/export)
- [ ] Advanced analytics dashboard
- [ ] Search and filtering improvements
- [ ] User activity logs
- [ ] Two-factor authentication
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Scheduled content publishing
- [ ] Content versioning/history

## Support & Documentation

- Main README: See `../README.md`
- Backend Setup: See `../backend/README.md`
- Admin Panel Guide: See `./README.md`
- API Documentation: See `../PAGES_AND_APIS.md`

## Environment Variables Reference

```
# Admin Panel (.env)
VITE_API_URL=http://localhost:5000/api    # Backend API URL
VITE_ADMIN_PORT=5174                       # Dev server port

# Backend (.env) - Required for admin panel to work
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mysqrfit24_db
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## Changelog

### Version 1.0.0
- Initial release
- Full admin panel with 7 management modules
- JWT authentication
- Responsive design
- Database integration
- API endpoints for locations, users, settings

---

For more information about the overall project, see the main README.md file.
