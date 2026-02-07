const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { connectDB } = require('../config/db');
const Note = require('../models/Note');
const GameScore = require('../models/GameScore');
const FileMeta = require('../models/FileMeta');

async function migrate() {
  await connectDB();

  // Migrate notes
  try {
    const notesPath = path.join(__dirname, '../data/notes.json');
    if (fs.existsSync(notesPath)) {
      const notesData = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
      if (Array.isArray(notesData) && notesData.length > 0) {
        const docs = notesData.map((n) => ({
          userId: n.userId || undefined,
          title: n.title,
          content: n.content,
          tags: n.tags || [],
          createdAt: n.createdAt ? new Date(n.createdAt) : undefined,
          updatedAt: n.updatedAt ? new Date(n.updatedAt) : undefined,
        }));
        await Note.insertMany(docs, { ordered: false });
        console.log(`Inserted ${docs.length} notes`);
      } else {
        console.log('No notes to migrate');
      }
    }
  } catch (err) {
    console.error('Notes migration error:', err.message);
  }

  // Migrate game scores
  try {
    const scoresPath = path.join(__dirname, '../data/gameScores.json');
    if (fs.existsSync(scoresPath)) {
      const scoresData = JSON.parse(fs.readFileSync(scoresPath, 'utf8'));
      const types = Object.keys(scoresData || {});
      let total = 0;
      for (const t of types) {
        const arr = scoresData[t];
        if (Array.isArray(arr) && arr.length > 0) {
          const docs = arr.map((s) => ({
            gameType: t,
            playerName: s.playerName || 'Player',
            score: s.score || 0,
            details: s.details || {},
            userId: s.userId || undefined,
            timestamp: s.timestamp ? new Date(s.timestamp) : undefined,
          }));
          await GameScore.insertMany(docs, { ordered: false });
          total += docs.length;
        }
      }
      console.log(`Inserted ${total} game scores`);
    }
  } catch (err) {
    console.error('Game scores migration error:', err.message);
  }

  // Migrate uploads metadata
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const docs = files.map((f) => {
        const stat = fs.statSync(path.join(uploadsDir, f));
        return {
          filename: f,
          url: `/uploads/${f}`,
          size: stat.size,
          mimetype: 'application/octet-stream',
          uploadedAt: stat.mtime,
        };
      });
      if (docs.length > 0) {
        await FileMeta.insertMany(docs, { ordered: false });
        console.log(`Inserted ${docs.length} file metadata docs`);
      } else {
        console.log('No upload files to migrate');
      }
    }
  } catch (err) {
    console.error('Files migration error:', err.message);
  }

  console.log('Migration complete');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
