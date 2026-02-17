<<<<<<< HEAD
# MERN Lab Project

A beginner-friendly MERN (MongoDB, Express, React, Node.js) stack boilerplate for web development learning.

## Project Structure

```
Web_Project/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context for global state
│   │   ├── services/      # API services with Axios
│   │   ├── routes/        # React Router configuration
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                # Express backend
│   ├── config/            # Configuration files
│   ├── models/            # MongoDB Mongoose models
│   ├── routes/            # Express routes
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # File uploads directory
│   ├── app.js             # Express app setup
│   ├── server.js          # Server entry point
│   └── package.json
├── .env                   # Environment variables
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Features

- **Frontend (React)**
  - React Router v6 for navigation
  - React Context API for state management (Auth & Theme)
  - Axios for API requests
  - Responsive UI with CSS styling
  - Dark/Light theme toggle

- **Backend (Express)**
  - Express.js server
  - MongoDB with Mongoose ODM
  - JWT authentication
  - MVC architecture
  - Error handling middleware
  - CORS support

- **Pages**
  - Dashboard
  - Login / Register
  - Notes
  - Calendar
  - Alarm
  - Games

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root with:
```
MONGODB_URI=mongodb+srv://limassoubello_db_user:***********@cluster0.yculwjb.mongodb.net/mern-lab?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=******
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get user profile (requires auth)

### Notes
- `GET /api/notes` - Get all notes (requires auth)
- `GET /api/notes/:id` - Get note by ID (requires auth)
- `POST /api/notes` - Create note (requires auth)
- `PUT /api/notes/:id` - Update note (requires auth)
- `DELETE /api/notes/:id` - Delete note (requires auth)

### Alarms
- `GET /api/alarms` - Get all alarms (requires auth)
- `POST /api/alarms` - Create alarm (requires auth)
- `PUT /api/alarms/:id` - Update alarm (requires auth)
- `DELETE /api/alarms/:id` - Delete alarm (requires auth)

### Games
- `GET /api/games/scores` - Get user scores (requires auth)
- `POST /api/games/scores` - Submit score (requires auth)
- `GET /api/games/leaderboard` - Get leaderboard

## Technologies Used

### Frontend
- React 18
- React Router v6
- Axios
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)

## Learning Points

This boilerplate covers:
- MERN stack architecture
- JWT authentication
- RESTful API design
- MongoDB schema design
- React hooks and Context API
- Error handling and middleware
- Environment configuration

## Next Steps

1. Implement password hashing with bcrypt
2. Add input validation (client & server)
3. Implement refresh token mechanism
4. Add file upload functionality
5. Create comprehensive error handling
6. Add unit and integration tests
7. Implement real-time features with Socket.io
8. Deploy to production

## Notes

- This is a beginner-friendly boilerplate
- Passwords are stored as plain text - use bcrypt in production
- JWT secret should be securely managed
- Add rate limiting for production
- Implement proper input validation

## License

ISC
=======
# WebAlarm
Web Project
>>>>>>> 55e2c4c50d5f3e14b5f83938c759703ceb73ecfd
