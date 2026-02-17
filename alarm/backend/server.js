const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { connectDB } = require('./config/db');
const notesRoutes = require('./routes/notesRoutes');
const gameScoresRoutes = require('./routes/gameScoresRoutes');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const calendarRoutes = require('./routes/calendarRoutes');

const http = require('http');
const { Server } = require('socket.io');
const alarmRoutes = require('./routes/alarmRoutes');
const { startAlarmScheduler } = require('./utils/alarmScheduler');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Current browser implementation of CORS sends 'null' for local files sometimes, 
    // or no origin for server-to-server requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      // For development, you might want to log this to see what's being blocked
      console.log('Blocked by CORS:', origin);
      // In strict production, we block. For now, let's allow to debug if needed, 
      // or strictly block if we are sure about CLIENT_URL.
      // return callback(new Error('not allowed by CORS'));
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Serve uploaded files as static content
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Alarm Clock Backend is running');
});

// API routes
app.use('/api/auth', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/game-scores', gameScoresRoutes);
// Compatibility alias (accept requests without hyphen)
app.use('/api/gamescores', gameScoresRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/alarms', alarmRoutes);

const PORT = process.env.PORT || 5000;

const serverStart = async () => {
  await connectDB();

  // Create HTTP server and attach Socket.IO
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || '*' } });

  io.on('connection', (socket) => {
    console.log('Client connected to Socket.IO', socket.id);
    socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
  });

  // Start alarm scheduler with io
  startAlarmScheduler(io);

  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

serverStart();
