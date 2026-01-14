# Admin Login & Registration Guide

## 🔐 Admin Login Page

**URL**: `http://localhost:5173/admin/login`

The improved admin login page features both login and registration in a clean, tabbed interface.

---

## Features

### ✨ Login Tab
- Enter your admin email and password
- Show/hide password visibility toggle
- Remember me functionality (via localStorage)
- Error messages for failed login attempts
- Redirects to admin dashboard on successful login

### ✨ Register Tab
- Create a new admin account
- Email validation
- Password strength requirements (minimum 6 characters)
- Confirm password field
- Password visibility toggles
- First admin gets full system access
- Helpful tip about first admin privileges

---

## How to Create Your First Admin Account

### Step 1: Go to Admin Login Page
Visit: `http://localhost:5173/admin/login`

### Step 2: Click "Register" Tab
Click the "Register" tab to switch from login to registration.

### Step 3: Enter Account Details
1. **Email**: Enter your admin email (e.g., admin@example.com)
2. **Password**: Create a password (minimum 6 characters)
3. **Confirm Password**: Re-enter the password to confirm

### Step 4: Click "Create Account"
- System validates all fields
- Passwords must match
- Password must be at least 6 characters
- Email must be valid format

### Step 5: Access Admin Panel
After successful registration:
- You're automatically logged in
- Redirected to `/admin` dashboard
- Your authentication token is stored locally

---

## How to Login to Existing Account

### Step 1: Go to Admin Login Page
Visit: `http://localhost:5173/admin/login`

### Step 2: Click "Login" Tab
(This is the default tab)

### Step 3: Enter Credentials
1. **Email**: Your admin email
2. **Password**: Your password

### Step 4: Click "Sign In"
- System validates credentials
- Checks email exists and password matches
- Shows error if credentials are invalid

### Step 5: Access Admin Panel
Successful login redirects to `/admin` dashboard.

---

## 🔒 Security Features

✅ **Password Hashing**
- Passwords hashed with bcryptjs on backend
- Never stored as plain text

✅ **JWT Authentication**
- Token-based authentication
- Tokens expire after 7 days
- Token stored in localStorage

✅ **Input Validation**
- Email format validation
- Password length validation
- Confirmation password matching
- Server-side validation

✅ **Error Handling**
- Clear error messages
- No sensitive information exposed
- Failed login attempts show generic error

---

## 🎯 First Admin Setup

### Important: First Admin Gets Full Access

The **first person to register** automatically becomes an admin with:
- ✅ Full system access
- ✅ Can manage properties
- ✅ Can manage legal content
- ✅ Can upload files
- ✅ Can view inquiries
- ✅ Can manage contact messages

### Subsequent Users
Users registered after the first admin will:
- ✅ Also get admin access (current system design)
- ⚠️ Consider restricting in production

---

## 🔧 API Endpoints Used

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "is_admin": true
  }
}
```

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
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

## ❌ Common Errors & Solutions

### "Invalid email or password"
**Cause**: Wrong email or password
**Solution**: 
- Check email spelling
- Verify password (case-sensitive)
- Reset password if forgotten (not yet implemented)

### "Passwords do not match"
**Cause**: Confirm password doesn't match password field
**Solution**: Retype both passwords carefully

### "Password must be at least 6 characters"
**Cause**: Password too short
**Solution**: Use a password with 6+ characters

### "Please fill in all fields"
**Cause**: One or more fields are empty
**Solution**: Fill in email, password, and confirm password

### "Email already exists"
**Cause**: This email is already registered
**Solution**: Use a different email or login with existing account

### "Failed to create account"
**Cause**: Backend error
**Solution**: 
- Check backend is running (`npm start`)
- Verify database is connected
- Check browser console for details

---

## 🔄 Token Management

### How Tokens Work
1. Login/Register returns JWT token
2. Token stored in `localStorage` as `authToken`
3. Token included in all admin requests
4. Token expires after 7 days
5. User must login again after expiration

### Token Storage
```javascript
// Token stored at:
localStorage.getItem('authToken')

// Token format:
Authorization: Bearer <token>
```

### Auto-Redirect
If user is already logged in and visits `/admin/login`:
- Automatically redirected to `/admin` dashboard
- No need to login again

---

## 🎨 UI Components

### Login Form
- Email input field
- Password input with visibility toggle
- Submit button
- Error alert (if any)

### Register Form
- Email input field
- Password input with visibility toggle
- Confirm password field with visibility toggle
- Submit button
- Helpful tip about first admin
- Error alert (if any)

### Tab Navigation
- Easy switching between Login and Register
- Icons for better visual clarity
- Responsive on mobile

---

## 📱 Responsive Design

The admin login page is fully responsive:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px+)
- ✅ Mobile (320px+)

Works on:
- Chrome, Firefox, Safari, Edge
- iOS and Android browsers
- All modern devices

---

## 🚀 Next Steps After Login

### First Time Setup
1. ✅ Create admin account
2. Go to `/admin` dashboard
3. Go to `/admin/legal` to add legal content
4. Start managing properties

### Regular Usage
1. Login at `/admin/login`
2. Access admin dashboard `/admin`
3. Manage legal content `/admin/legal`
4. View inquiries and messages

---

## 🔒 Password Best Practices

### Strong Password
✅ At least 8+ characters (minimum is 6)
✅ Mix of uppercase and lowercase letters
✅ Include numbers
✅ Include special characters (!@#$%^&*)
✅ Not your name or username

### Example Strong Passwords
- `Admin!2024@Secure`
- `MySqrfit#PropsManage24`
- `P@ss2024!Admin`

### Weak Passwords (Avoid)
❌ `123456`
❌ `password`
❌ `admin123`
❌ `qwerty`
❌ Your name

---

## 📋 Session Management

### Current Session
- Logged in user can access all admin features
- Token valid for 7 days from login
- Auto-logout on token expiration

### Multiple Admin Accounts
- Unlimited number of admins can be created
- Each admin has their own login
- Each admin gets full system access
- No role-based restrictions (in current design)

### Logout
Logout by:
1. Clicking "Logout" button in admin panel
2. Clearing localStorage manually
3. Session expires after 7 days

---

## 🔐 Advanced: Token Refresh

The current system uses:
- **JWT Tokens**: 7-day expiration
- **Storage**: localStorage

Future improvements could include:
- Refresh tokens
- Sliding window expiration
- Session timeout warnings
- Remember me functionality

---

## 📞 Troubleshooting

### Can't Access Login Page
- Check URL: `http://localhost:5173/admin/login`
- Verify frontend is running: `npm run dev`
- Check browser console for errors (F12)

### Login Fails with Network Error
- Backend not running: `npm start`
- Check backend URL in `.env`: `VITE_API_URL=http://localhost:5000/api`
- Verify CORS is enabled in backend

### Token Issues
- Clear localStorage: Open DevTools → Application → Clear Storage
- Login again to get new token
- Restart browser if needed

### Page Keeps Redirecting to Login
- Token might be invalid or expired
- Clear cache and login again
- Check localStorage for valid token

---

## 🎓 Code Reference

**File**: `src/pages/AdminLogin.tsx`

Key functions:
- `handleLogin()` - Process login request
- `handleRegister()` - Process registration
- `useEffect()` - Check if already logged in

Main states:
- `email` - User email input
- `password` - User password
- `confirmPassword` - Registration confirmation
- `isLoading` - Loading state during request
- `error` - Error message display

---

## 📊 Admin Login Statistics

### Form Fields (Login)
- Email input
- Password input
- 1 Submit button

### Form Fields (Register)
- Email input
- Password input
- Confirm password input
- 1 Submit button

### Total UI Elements
- 2 Tab triggers
- 2 Forms
- Multiple input fields
- 2 Submit buttons
- Error alert
- Helpful tip

---

## ✨ Features Summary

| Feature | Status | Details |
|---------|--------|---------|
| User Login | ✅ Active | Email/password auth |
| User Registration | ✅ Active | Create new accounts |
| Password Visibility | ✅ Active | Show/hide toggle |
| Error Messages | ✅ Active | Clear feedback |
| Tab Navigation | ✅ Active | Easy switching |
| Auto-Redirect | ✅ Active | Login → Dashboard |
| Token Storage | ✅ Active | localStorage |
| Input Validation | ✅ Active | Client & server |

---

**Your admin login is ready to use! 🎉**

Start by visiting: `http://localhost:5173/admin/login`
