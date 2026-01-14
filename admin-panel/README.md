# MySqrfit Admin Panel

A comprehensive admin panel for managing all MySqrfit platform content and settings.

## Features

- **Properties Management**: Add, edit, and delete property listings
- **Locations Management**: Manage locations/regions with map coordinates
- **Images & Media**: Upload and manage images and documents
- **Users Management**: View and manage user accounts
- **Blog Management**: Create and publish blog posts
- **Settings Management**: Configure site-wide settings
- **Inquiries & Messages**: View and manage customer inquiries and contact messages

## Prerequisites

- Node.js 16+
- npm or yarn
- Running backend API server (localhost:5000)

## Installation

```bash
cd admin-panel
npm install
```

## Environment Setup

Create a `.env` file in the admin-panel directory:

```
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PORT=5174
```

## Development

Start the development server:

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5174`

## Build

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── admin/                    # Admin management components
│   │   ├── PropertiesManagement.tsx
│   │   ├── LocationsManagement.tsx
│   │   ├── ImagesManagement.tsx
│   │   ├── UsersManagement.tsx
│   │   ├── BlogManagement.tsx
│   │   ├── SettingsManagement.tsx
│   │   └── InquiriesManagement.tsx
│   └── ui/                       # Reusable UI components
├── pages/
│   ├── Login.tsx                 # Admin login page
│   └── AdminDashboard.tsx        # Main dashboard
├── hooks/
│   └── useAuth.ts               # Authentication hook
├── services/
│   └── api.ts                   # API service
├── types/
│   └── index.ts                 # TypeScript types
├── lib/
│   └── utils.ts                 # Utility functions
├── App.tsx                       # Main app component
└── main.tsx                      # Entry point
```

## Authentication

1. Navigate to `/login`
2. Enter admin credentials
3. Token is stored in localStorage as `adminToken`
4. All API requests automatically include the auth token

## API Integration

The admin panel connects to the backend API at the configured `VITE_API_URL`. Ensure the backend is running and all required API endpoints are available.

### Required Backend Endpoints

- `POST /api/auth/login` - Admin login
- `GET/POST/PUT/DELETE /api/properties` - Property management
- `GET/POST/PUT/DELETE /api/locations` - Location management
- `GET/POST/DELETE /api/files` - File management
- `GET/POST/PUT/DELETE /api/blog` - Blog management
- `GET/PUT /api/settings` - Site settings
- `GET/PUT/DELETE /api/users` - User management
- `GET /api/chatbot/inquiries` - Chatbot inquiries
- `GET /api/contact` - Contact messages

## Styling

- **Framework**: Tailwind CSS
- **UI Components**: ShadCN UI / Radix UI
- **Icons**: Lucide React

## State Management

- React hooks for component state
- localStorage for authentication
- React Query for API data fetching

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please refer to the main project documentation or contact the development team.
