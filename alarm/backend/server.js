const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { connectDB } = require('./config/db');
const notesRoutes = require('./routes/notesRoutes');
const gameScoresRoutes = require('./routes/gameScoresRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files as static content
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Alarm Clock Backend is running');
});

// API routes
app.use('/api/notes', notesRoutes);
app.use('/api/game-scores', gameScoresRoutes);
// Compatibility alias (accept requests without hyphen)
app.use('/api/gamescores', gameScoresRoutes);
app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
})();
