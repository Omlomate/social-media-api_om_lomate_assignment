
# Social Media API

## Overview

This project provides a backend API for a social media platform with user authentication, post creation, commenting, and real-time features such as notifications and chat.

### Day 1: Basic Functionality
1. **User Authentication**
   - User registration and login with JWT-based authentication.
   
2. **Post Management**
   - Create and fetch posts.
   
3. **Comment Management**
   - Add comments to posts.

### Day 2: Extended Features
1. **Real-Time Notifications**
   - Socket.io integration for broadcasting notifications when a new comment is added.

2. **Pagination**
   - Pagination support for fetching posts using query parameters.

### Day 3: Real-Time Chat and Frontend Integration
1. **Real-Time Chat**
   - One-to-one chat functionality using Socket.io.
   - Users can send and receive messages in real-time.

2. **Frontend Integration**
   - A React-based frontend (`Chat.js`) was added to enable chat interactions and notifications.

---

## Project Structure

```
social-media-api/
├── .env
├── server.js
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Comment.js
├── routes/
│   ├── auth.js
│   ├── posts.js
│   └── comments.js
├── middleware/
│   └── authMiddleware.js
└── client/
    ├── src/
    │   ├── components/
    │   │   └── Chat.js
    │   └── App.js
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- MongoDB (local or cloud instance)
- Thunder Client/Postman for API testing

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Omlomate/social-media-api_om_lomate_assignment.git
   cd social-media-api
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Navigate to the `client` directory and install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

4. Configure environment variables for the backend (`.env` file in root):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

6. Start the React frontend:
   ```bash
   cd client
   npm start
   ```

---

## API Endpoints

### User Authentication
| Method | Endpoint            | Description       |
|--------|---------------------|-------------------|
| POST   | /api/auth/register  | Register a new user |
| POST   | /api/auth/login     | Login a user       |

### Post Management
| Method | Endpoint   | Description           |
|--------|------------|-----------------------|
| POST   | /api/posts | Create a new post     |
| GET    | /api/posts | Fetch all posts       |

### Comment Management
| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| POST   | /api/comments  | Add a comment to post |

### Real-Time Chat
The chat feature is integrated using Socket.io. Refer to the frontend's `Chat.js` for implementation details.

---

## Real-Time Features

### Notifications
- Notifications are emitted to all users when a new comment is added.

### Chat
- One-to-one messaging system using WebSocket connections.

---

## Dependencies

- Backend:
  - Express
  - Mongoose
  - dotenv
  - bcrypt
  - jsonwebtoken
  - Socket.io

---

