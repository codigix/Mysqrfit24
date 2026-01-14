# MySqrfit24 - Development Server Startup Guide

## Quick Start (All Servers Together)

### Windows
```bash
npm run dev:all
```
Or double-click: `start-all.bat`

### Linux/Mac
```bash
npm run dev:all
```
Or run: `./start-all.sh`

---

## Individual Server Startup

### Start Backend Only (Port 5000)
```bash
npm run dev:backend
```

### Start Frontend Only (Port 8081)
```bash
npm run dev:frontend
```

### Start Admin Panel Only (Port 5174)
```bash
npm run dev:admin
```

---

## Server Endpoints

| Service | URL | Port |
|---------|-----|------|
| **Backend API** | http://localhost:5000 | 5000 |
| **Frontend** | http://localhost:8081 | 8081 |
| **Admin Panel** | http://localhost:5174 | 5174 |

---

## First Time Setup

### 1. Install Dependencies
```bash
cd d:\projects\Mysqrfit24
npm install

cd backend
npm install

cd ../admin-panel
npm install
```

### 2. Setup Environment Variables
Backend `.env` should contain:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=mysqrfit24_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

### 3. Initialize Database
```bash
cd backend
npm run init-db
```

### 4. Start All Servers
```bash
npm run dev:all
```

---

## Admin Panel Registration & Login

### Register New Admin
1. Go to `http://localhost:5174/login`
2. Click "Register" tab
3. Enter email and password (min 6 characters)
4. Click "Register"

### Login to Admin Panel
1. Go to `http://localhost:5174/login`
2. Click "Login" tab
3. Enter email and password
4. Access dashboard with 7 management sections:
   - Properties
   - Locations
   - Media/Images
   - Users
   - Blog Posts
   - Site Settings
   - Inquiries/Messages

### Alternative: Register via Frontend
1. Go to `http://localhost:8081`
2. Click "Admin" button (top right)
3. Select "Register"
4. Create account
5. Admin panel opens automatically in new tab

---

## Troubleshooting

### Port Already in Use
If a port is already in use:
- Kill the process: `taskkill /F /IM node.exe` (Windows)
- Or change the port in environment variables

### Database Connection Error
1. Ensure MySQL is running
2. Verify credentials in `backend/.env`
3. Run `npm run init-db` in backend directory

### API Connection Refused
- Ensure backend is running on port 5000
- Check CORS is configured for all origins
- Verify `VITE_API_URL` in frontend `.env`

---

## Development Workflow

With `npm run dev:all` running:
- **Frontend changes**: Auto-reloads at `http://localhost:8081`
- **Backend changes**: Restart the server (Ctrl+C, then run again)
- **Admin panel changes**: Auto-reloads at `http://localhost:5174`

---

## Project Structure

```
Mysqrfit24/
├── backend/              # Express API server
│   ├── controllers/
│   ├── routes/
│   ├── config/
│   └── server.js
├── src/                  # Main frontend (Vite + React)
│   ├── pages/
│   ├── components/
│   └── services/
├── admin-panel/          # Admin dashboard (Vite + React)
│   ├── src/
│   ├── vite.config.ts
│   └── package.json
└── package.json
```
