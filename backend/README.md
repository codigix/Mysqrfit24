# MySqrfit24 Backend

Backend API for MySqrfit24 real estate platform built with Node.js, Express, and MySQL.

## Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- MySQL Server (v5.7+)
- npm or yarn

### 2. Installation

```bash
cd backend
npm install
```

### 3. Database Setup

1. **Create database and tables:**
   ```bash
   mysql -u root -p < config/database.sql
   ```
   When prompted, enter your MySQL password.

2. **Or manually:**
   - Open MySQL Workbench or mysql-cli
   - Run the SQL queries in `config/database.sql`

### 4. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development

   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=mysqrfit24_db
   DB_PORT=3306

   JWT_SECRET=your_super_secret_key_here
   JWT_EXPIRE=7d

   ADMIN_EMAIL=admin@mysqrfit24.com
   ADMIN_PASSWORD=Admin@123

   CLIENT_URL=http://localhost:5173
   ```

### 5. Start Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Create admin account
- **POST** `/api/auth/login` - Admin login

### Properties
- **GET** `/api/properties` - Get all properties (with filters)
- **GET** `/api/properties/:id` - Get property by ID
- **POST** `/api/properties` - Create property (admin only)
- **PUT** `/api/properties/:id` - Update property (admin only)
- **DELETE** `/api/properties/:id` - Delete property (admin only)

### Chatbot
- **POST** `/api/chatbot/inquiries` - Create inquiry
- **GET** `/api/chatbot/inquiries` - Get all inquiries (admin only)
- **DELETE** `/api/chatbot/inquiries/:id` - Delete inquiry (admin only)

### Health Check
- **GET** `/api/health` - Server status

## Database Schema

### Tables
1. **users** - Admin users
2. **properties** - Property listings
3. **chatbot_inquiries** - Chatbot inquiries
4. **property_images** - Property images
5. **property_reviews** - Property reviews
6. **admin_logs** - Admin action logs

## Authentication

Bearer token authentication is used for admin endpoints.

Example request:
```bash
curl -X GET http://localhost:5000/api/properties \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Error Handling

All errors return JSON format:
```json
{
  "error": "Error message"
}
```

## Development Notes

- Database uses InnoDB storage engine
- Timestamps are automatically managed (created_at, updated_at)
- Features and images are stored as JSON in database
- Full-text search is supported on property titles and descriptions

## Troubleshooting

### Database connection error
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database is created

### Port already in use
- Change `PORT` in `.env`
- Or kill existing process: `lsof -i :5000`

### CORS errors
- Update `CLIENT_URL` in `.env`
- Should match your frontend URL

## Next Steps

1. [Frontend Integration](#) - Connect frontend to backend
2. [Environment Setup](#) - Configure for production
3. [API Testing](#) - Test all endpoints
