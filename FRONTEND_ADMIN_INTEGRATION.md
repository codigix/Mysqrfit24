# Frontend & Admin Panel Integration Guide

## Overview

The main frontend (port 5173) is now fully integrated with the dedicated admin panel (port 5174). They share the same backend API and authentication system, allowing seamless navigation between both applications.

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (5173)                          │
│  ├── Login at /admin/login                                 │
│  ├── Sets tokens in localStorage                           │
│  ├── Admin button in Navigation                            │
│  └── Redirects to admin panel (5174)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Shared Authentication
                       │ (authToken in localStorage)
                       │
┌──────────────────────┴──────────────────────────────────────┐
│               Admin Panel (5174)                            │
│  ├── Reads authToken from localStorage                     │
│  ├── Full management dashboard                             │
│  ├── 7 management modules                                  │
│  └── Auto-logout when token expires                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │
┌──────────────────────┴──────────────────────────────────────┐
│            Backend API (5000)                               │
│  ├── JWT Authentication                                    │
│  ├── Authorization checks                                  │
│  ├── All resources & data                                  │
│  └── CORS enabled for both frontends                       │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

### 1. Frontend Login to Admin Panel

```
User visits http://localhost:5173/admin/login
    ↓
Enters email & password
    ↓
Frontend calls /api/auth/login
    ↓
Backend returns JWT token
    ↓
Frontend stores token in:
  - localStorage.authToken (for frontend)
  - localStorage.adminToken (for admin panel)
  - localStorage.adminUser (user data)
    ↓
Admin button appears in Navigation
    ↓
User clicks "Admin" button
    ↓
Admin panel opens: http://localhost:5174/dashboard
    ↓
Admin panel reads token from localStorage
    ↓
User sees full management dashboard
```

### 2. Token Synchronization

Both applications check for tokens in this order:
1. `adminToken` (admin-panel specific)
2. `authToken` (frontend specific)

This allows tokens to be passed between them:

```javascript
// Admin Panel - useAuth hook
const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');

// Admin Panel - API service
const getToken = () => {
  return localStorage.getItem('adminToken') || localStorage.getItem('authToken');
};
```

## Frontend Integration

### Navigation Bar Updates

The main navigation bar now includes an admin button:

```
Home | Properties | About Us | [Phone] | [Admin Button]
```

**Desktop View:**
- Shows "Admin" button with settings icon when logged in
- Shows small settings icon when not logged in

**Mobile View:**
- Admin panel link appears in mobile menu when logged in

### Admin Access Points

#### 1. Through Navigation Button
1. Go to any frontend page
2. If logged in, click "Admin" button in top right
3. Admin panel opens in new tab

#### 2. Direct URL
- Frontend Admin Login: `http://localhost:5173/admin/login`
- After login, click "Admin" button to access panel

#### 3. Keyboard Shortcut (Optional)
Users can bookmark: `http://localhost:5174/dashboard`

## Admin Panel Integration

### How Admin Panel Receives Authentication

The admin panel receives the JWT token through:

1. **localStorage** - Primary method
   - Reads `adminToken` or `authToken`
   - Automatically persists across browser refreshes

2. **API Headers** - Secondary method
   - All API requests include `Authorization: Bearer <token>`
   - Backend verifies token on each request

### Automatic Redirection

When admin logs in from frontend:

```javascript
// AdminLogin.tsx
const response = await apiService.auth.login(email, password);

if (response.token) {
  localStorage.setItem('authToken', response.token);      // Frontend
  localStorage.setItem('adminToken', response.token);     // Admin panel
  localStorage.setItem('adminUser', JSON.stringify(...)); // User data
  
  window.open('http://localhost:5174/dashboard', '_blank'); // Opens admin panel
  navigate('/');                                            // Redirects to home
}
```

## Running Both Applications

### Terminal Setup (Recommended)

Open 3 terminal windows:

**Terminal 1 - Backend**
```bash
cd backend
npm start
# Output: ✓ Backend server running on http://localhost:5000
```

**Terminal 2 - Frontend**
```bash
npm run dev
# Output: ✓ Local: http://localhost:5173
```

**Terminal 3 - Admin Panel**
```bash
cd admin-panel
npm run dev
# Output: ✓ Local: http://localhost:5174
```

### Quick Start Script (Optional)

Create `start-all.sh` in project root:

```bash
#!/bin/bash

# Start backend
cd backend && npm start &
BG_PID1=$!

# Start frontend
npm run dev &
BG_PID2=$!

# Start admin panel
cd admin-panel && npm run dev &
BG_PID3=$!

echo "All services started!"
echo "Frontend: http://localhost:5173"
echo "Admin Panel: http://localhost:5174"
echo "Backend: http://localhost:5000"

# Cleanup on exit
trap "kill $BG_PID1 $BG_PID2 $BG_PID3" EXIT
```

Run with: `chmod +x start-all.sh && ./start-all.sh`

## User Journey

### Admin User Flow

```
1. Visit Frontend (5173)
   ↓
2. Click /admin/login
   ↓
3. Enter credentials
   ↓
4. System stores tokens in localStorage
   ↓
5. User sees "Admin" button in navigation
   ↓
6. Click "Admin" button
   ↓
7. Admin Panel opens (5174)
   ↓
8. Full management dashboard available
   ↓
9. Add/Edit/Delete data
   ↓
10. Log out (clears tokens)
```

### Regular User Flow

```
1. Visit Frontend (5173)
2. Browse properties
3. Fill contact forms
4. No access to admin features
5. No "Admin" button visible
```

## Token Management

### Setting Tokens (Login)

```javascript
// Admin login
localStorage.setItem('authToken', response.token);
localStorage.setItem('adminToken', response.token);
localStorage.setItem('adminUser', JSON.stringify(response.user));
```

### Reading Tokens

```javascript
// Frontend
const token = localStorage.getItem('authToken');

// Admin Panel
const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
```

### Clearing Tokens (Logout)

```javascript
// Frontend
localStorage.removeItem('authToken');

// Admin Panel
localStorage.removeItem('adminToken');
localStorage.removeItem('adminUser');

// Or logout from admin panel, then:
// Refresh frontend to update UI
```

## CORS Configuration

The backend CORS is configured to accept requests from:

- `http://localhost:5173` (Frontend)
- `http://localhost:5174` (Admin Panel)
- `http://localhost:3000` (Testing/Development)

Update `backend/.env` if using different ports:

```env
CLIENT_URL=http://localhost:5173
# Backend automatically allows 5174 and 3000
```

## Troubleshooting

### "Admin Button Not Showing"

**Cause:** Not logged in
**Solution:** 
1. Go to `/admin/login`
2. Enter credentials
3. Admin button should appear in navigation

### "Cannot Access Admin Panel"

**Cause:** Token not synced
**Solution:**
1. Clear localStorage: Open DevTools → Application → Storage → Clear All
2. Log in again at `/admin/login`
3. Click Admin button

### "401 Unauthorized Error"

**Cause:** Token expired or invalid
**Solution:**
1. Log out and log in again
2. Check token in DevTools: `localStorage.getItem('authToken')`
3. Verify backend is running

### "Admin Panel on Port 5174 Not Responding"

**Cause:** Admin panel not started
**Solution:**
```bash
cd admin-panel
npm run dev
```

### "Frontend Can't Connect to Backend"

**Cause:** Backend not running
**Solution:**
```bash
cd backend
npm start
```

## Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```

### Admin Panel (`admin-panel/.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PORT=5174
```

### Backend (`backend/.env`)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mysqrfit24_db
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## Data Synchronization

### Frontend Shows:
- Public properties
- Public blog posts
- Contact forms
- Chatbot inquiries
- Legal pages

### Admin Panel Manages:
- All properties (add/edit/delete)
- All locations
- All images
- User accounts
- Blog posts (draft & published)
- Site settings
- Inquiries & messages

### Real-time Updates

When admin makes changes:
1. Data updates in database
2. Frontend automatically shows new data on refresh
3. Admin panel shows immediate feedback

## Security Considerations

1. **Token Storage:** Using localStorage (suitable for admin panel)
2. **XSS Protection:** No sensitive data in localStorage except token
3. **HTTPS in Production:** Must use HTTPS for all URLs
4. **Token Expiration:** Set via JWT_EXPIRE in backend
5. **Admin-Only Routes:** Backend checks admin role on protected endpoints

## Best Practices

1. **Always use HTTPS in production**
2. **Rotate JWT secret regularly**
3. **Monitor admin activity via logs**
4. **Implement rate limiting**
5. **Use strong passwords**
6. **Enable 2FA for admin accounts** (future enhancement)
7. **Audit admin changes** (future enhancement)

## Future Enhancements

- [ ] 2-Factor authentication
- [ ] Admin activity logging
- [ ] Audit trails
- [ ] Session management
- [ ] IP whitelisting
- [ ] Admin profile page
- [ ] Password change
- [ ] Account recovery
- [ ] Permissions/Roles system
- [ ] Dark mode support

## Support & Documentation

- **Main README:** `README.md`
- **Admin Panel Setup:** `ADMIN_PANEL_SETUP.md`
- **Running Admin Panel:** `RUN_ADMIN_PANEL.md`
- **API Documentation:** `PAGES_AND_APIS.md`

## Quick Links

| Resource | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Admin Panel | http://localhost:5174 |
| Backend API | http://localhost:5000 |
| Frontend Admin Login | http://localhost:5173/admin/login |
| Admin Dashboard | http://localhost:5174/dashboard |
| Backend Health | http://localhost:5000/api/health |

---

**Integration Complete!** The frontend and admin panel are now working seamlessly together.
