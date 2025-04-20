# RiverForo.com Technical Documentation

This document provides technical details about the RiverForo.com platform architecture, components, and implementation.

## Architecture Overview

RiverForo.com is built using the MERN stack:

- **MongoDB**: Document database for storing forum data
- **Express.js**: Backend API framework
- **React.js**: Frontend user interface
- **Node.js**: JavaScript runtime environment

Additional technologies:
- **Pusher**: Real-time communication for notifications and live updates
- **JWT**: Authentication and authorization
- **Google AdSense**: Monetization integration
- **i18next**: Multilingual support (Spanish/English)

## Directory Structure

```
riverforo/
├── backend/
│   ├── controllers/     # API endpoint handlers
│   ├── models/          # MongoDB schema definitions
│   ├── routes/          # API route definitions
│   ├── middleware/      # Express middleware
│   ├── utils/           # Helper functions
│   └── server.js        # Main server entry point
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # React components
│       ├── contexts/    # React context providers
│       ├── pages/       # Page components
│       ├── utils/       # Helper functions
│       ├── App.js       # Main application component
│       └── index.js     # Entry point
├── .env                 # Environment variables (not included in repo)
├── package.json         # Project dependencies
└── README.md            # Project overview
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  avatar: String (URL),
  role: String (enum: 'user', 'moderator', 'admin'),
  language: String (enum: 'es', 'en'),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isActive: Boolean,
  isBanned: Boolean,
  socialAuth: {
    google: { id: String, email: String },
    facebook: { id: String, email: String }
  },
  profile: {
    signature: String,
    location: String,
    bio: String
  },
  stats: {
    postCount: Number,
    threadCount: Number,
    reputation: Number
  },
  settings: {
    notifications: {
      email: Boolean,
      mentions: Boolean,
      replies: Boolean
    },
    privacy: {
      showOnline: Boolean,
      allowMessages: Boolean
    }
  }
}
```

### Categories Collection
```javascript
{
  _id: ObjectId,
  name: {
    es: String,
    en: String
  },
  description: {
    es: String,
    en: String
  },
  slug: String,
  order: Number,
  parentCategory: ObjectId (ref: 'Category'),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  permissions: {
    view: [String] (roles),
    create: [String] (roles)
  },
  stats: {
    threadCount: Number,
    postCount: Number,
    lastPost: {
      threadId: ObjectId,
      userId: ObjectId,
      username: String,
      timestamp: Date
    }
  }
}
```

### Threads Collection
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String,
  content: String (first post content),
  user: ObjectId (ref: 'User'),
  category: ObjectId (ref: 'Category'),
  createdAt: Date,
  updatedAt: Date,
  isPinned: Boolean,
  isLocked: Boolean,
  isDeleted: Boolean,
  views: Number,
  replies: Number,
  lastReply: {
    user: ObjectId (ref: 'User'),
    username: String,
    timestamp: Date
  },
  tags: [String]
}
```

### Posts Collection
```javascript
{
  _id: ObjectId,
  thread: ObjectId (ref: 'Thread'),
  user: ObjectId (ref: 'User'),
  content: String,
  createdAt: Date,
  updatedAt: Date,
  isDeleted: Boolean,
  isEdited: Boolean,
  editHistory: [{
    content: String,
    timestamp: Date
  }],
  likes: [ObjectId] (ref: 'User'),
  mentions: [ObjectId] (ref: 'User'),
  attachments: [{
    type: String,
    url: String,
    name: String
  }]
}
```

### Notifications Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  type: String (enum: 'reply', 'mention', 'like', 'system'),
  sender: ObjectId (ref: 'User'),
  thread: ObjectId (ref: 'Thread'),
  post: ObjectId (ref: 'Post'),
  content: String,
  isRead: Boolean,
  createdAt: Date
}
```

### AdPlacements Collection
```javascript
{
  _id: ObjectId,
  name: String,
  location: String (enum: 'header', 'sidebar', 'between-threads', 'between-posts', 'footer'),
  adCode: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  displayOrder: Number,
  responsive: {
    mobile: Boolean,
    tablet: Boolean,
    desktop: Boolean
  }
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/google` - Google authentication
- `POST /api/auth/facebook` - Facebook authentication

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/role` - Change user role (admin)
- `PUT /api/users/:id/ban` - Ban user (admin/moderator)
- `PUT /api/users/:id/unban` - Unban user (admin/moderator)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/slug/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)
- `GET /api/categories/:id/threads` - Get threads in category

### Threads
- `GET /api/threads` - Get all threads
- `GET /api/threads/:id` - Get thread by ID
- `GET /api/threads/slug/:slug` - Get thread by slug
- `POST /api/threads` - Create thread
- `PUT /api/threads/:id` - Update thread
- `DELETE /api/threads/:id` - Delete thread
- `PUT /api/threads/:id/pin` - Pin thread (admin/moderator)
- `PUT /api/threads/:id/unpin` - Unpin thread (admin/moderator)
- `PUT /api/threads/:id/lock` - Lock thread (admin/moderator)
- `PUT /api/threads/:id/unlock` - Unlock thread (admin/moderator)
- `PUT /api/threads/:id/move` - Move thread to different category (admin/moderator)

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `GET /api/threads/:threadId/posts` - Get posts in thread
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `DELETE /api/posts/:id/like` - Unlike post
- `POST /api/posts/:id/report` - Report post

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification

### AdPlacements
- `GET /api/ads` - Get all ad placements
- `GET /api/ads/:id` - Get ad placement by ID
- `POST /api/ads` - Create ad placement (admin)
- `PUT /api/ads/:id` - Update ad placement (admin)
- `DELETE /api/ads/:id` - Delete ad placement (admin)

## Authentication Flow

1. **Registration**:
   - User submits registration form
   - Server validates input
   - Password is hashed using bcrypt
   - User document is created in database
   - JWT token is generated and returned

2. **Login**:
   - User submits login form
   - Server validates credentials
   - JWT token is generated and returned
   - Token is stored in client (localStorage)

3. **Social Authentication**:
   - User clicks social login button
   - OAuth flow is initiated
   - Server receives OAuth code
   - Server exchanges code for user info
   - User is created or updated in database
   - JWT token is generated and returned

4. **Authorization**:
   - JWT token is sent with each API request
   - Server validates token
   - User permissions are checked for protected routes

## Real-time Features

Pusher is used for real-time communication:

1. **Notifications**:
   - Server sends event to Pusher when notification is created
   - Client subscribes to user-specific notification channel
   - Client receives and displays notifications in real-time

2. **Online Users**:
   - Client sends presence events to Pusher
   - Server tracks online users
   - Client displays currently online users

3. **Live Thread Updates**:
   - Server sends event when new posts are created
   - Client subscribes to thread-specific channels
   - Client updates thread view in real-time

## Multilingual Support

The platform supports Spanish (primary) and English:

1. **Server-side**:
   - Category names and descriptions stored in both languages
   - API returns content based on user language preference
   - Error messages available in both languages

2. **Client-side**:
   - i18next library for translation management
   - Language context provider for app-wide language state
   - Language toggle in header
   - User language preference stored in database

## Google AdSense Integration

AdSense is integrated throughout the platform:

1. **Ad Placements**:
   - Configurable ad locations stored in database
   - Responsive design for different devices
   - Admin controls for enabling/disabling ads

2. **Ad Components**:
   - React components for rendering ads
   - Lazy loading for better performance
   - Ad blocker detection

## Performance Optimizations

1. **Database**:
   - Indexes on frequently queried fields
   - Pagination for large result sets
   - Caching for frequently accessed data

2. **Frontend**:
   - Code splitting for reduced bundle size
   - Lazy loading of components
   - Optimized images and assets
   - Memoization of expensive calculations

3. **API**:
   - Rate limiting to prevent abuse
   - Response compression
   - Efficient query patterns

## Security Measures

1. **Authentication**:
   - JWT with expiration
   - Password hashing with bcrypt
   - CSRF protection
   - Rate limiting on auth endpoints

2. **Data Protection**:
   - Input validation and sanitization
   - XSS protection
   - SQL injection prevention
   - Secure HTTP headers

3. **Authorization**:
   - Role-based access control
   - Resource ownership validation
   - Middleware for protected routes

## Deployment Configuration

1. **Vercel**:
   - Serverless functions for API
   - Static hosting for frontend
   - Environment variables for configuration
   - Custom domain support

2. **MongoDB Atlas**:
   - Cloud-hosted database
   - Automatic backups
   - Network security rules
   - Performance monitoring

3. **Pusher**:
   - Secure authentication
   - Channel-based permissions
   - Event filtering

---

© 2025 RiverForo.com - All Rights Reserved
