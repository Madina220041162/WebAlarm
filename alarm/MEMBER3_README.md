# Member 3 - Notes, Files & Games Features

## 📋 Project Overview

This document outlines all features developed by **Member 3** for the WebAlarm project. The features include:

### ✅ Implemented Features

#### 1. 📝 **Notes Management**
- **Create**: Add new notes with title, content, and tags
- **Read**: View all notes in a grid layout with search functionality
- **Update**: Edit existing notes
- **Delete**: Remove notes (with confirmation)
- **Search**: Filter by title, content, or tags
- **Tags**: Tag-based organization

**Files:**
- `alarm/front/src/pages/Notes.jsx` - Notes component
- `alarm/front/src/pages/Notes.css` - Notes styling
- `alarm/backend/controllers/notesController.js` - Backend logic
- `alarm/backend/routes/notesRoutes.js` - API routes
- `alarm/backend/data/notes.json` - Data storage

**API Endpoints:**
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `GET /api/notes/:id` - Get single note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

---

#### 2. 📁 **File & Image Upload**
- **Upload**: Support for images (PNG, JPG, GIF, WebP), PDFs, and documents
- **Preview**: Image previews before upload
- **Download**: Download uploaded files
- **Delete**: Remove files
- **File Info**: Display file size and type

**Files:**
- `alarm/front/src/pages/FileUpload.jsx` - File upload component
- `alarm/front/src/pages/FileUpload.css` - File upload styling
- `alarm/backend/controllers/fileController.js` - File handling
- `alarm/backend/routes/fileRoutes.js` - File routes
- `alarm/backend/uploads/` - Storage directory

**API Endpoints:**
- `POST /api/files` - Upload file
- `GET /api/files` - List uploaded files
- `GET /uploads/:filename` - Download file
- `DELETE /api/files/:filename` - Delete file

**Supported File Types:**
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- Documents: `.pdf`, `.txt`, `.doc`, `.docx`
- Max file size: 50MB

---

#### 3. 🎮 **Games Hub**

##### Game 1: ⌨️ **Typing Test**
- **Duration**: 60 seconds
- **Rules**: 
  - Type as fast and accurate as possible
  - **No backspacing allowed!**
  - Incorrect matches penalize score
  - Completing phrases gives bonus points
- **Scoring**: +1 per correct character, +10 per completed phrase
- **Stats**: Score, mistakes, words per minute

**Files:**
- `alarm/front/src/games/TypingTest.jsx`
- `alarm/front/src/games/TypingTest.css`

##### Game 2: 🎯 **Math Dots Pattern**
- **Duration**: 30 seconds
- **Rules**:
  - Watch the pattern of dots light up
  - Repeat the pattern by clicking
  - Each level adds one more dot
  - Wrong click = game over
- **Scoring**: +10 × level per correct pattern
- **Difficulty**: Progressive - pattern grows each level

**Files:**
- `alarm/front/src/games/MathDots.jsx`
- `alarm/front/src/games/MathDots.css`

##### Game 3: 🎴 **Flip Grid Memory**
- **Duration**: 60 seconds
- **Grid**: 4×4 (16 cards)
- **Rules**:
  - Find matching pairs of symbols
  - Click to flip cards
  - Match all pairs before time runs out
- **Scoring**: +10 per pair, -1 per wrong attempt
- **Progress**: Visual bar showing pairs matched

**Files:**
- `alarm/front/src/games/FlipGrid.jsx`
- `alarm/front/src/games/FlipGrid.css`

##### Games Hub: 🎮 **Central Dashboard**
- Game selection interface
- High score display per game
- Leaderboards (top 5 per game)
- Score tracking and persistence

**Files:**
- `alarm/front/src/games/GamesHub.jsx`
- `alarm/front/src/games/GamesHub.css`

**API Endpoints:**
- `GET /api/game-scores/:gameType` - Get all scores
- `POST /api/game-scores/:gameType` - Save new score
- `GET /api/game-scores/:gameType/high?limit=10` - Get high scores

**Game Types:**
- `typingTest`
- `mathDots`
- `flipGrid`

---

## 🏗️ Backend Architecture

### Controllers
```
controllers/
├── notesController.js       # CRUD operations for notes
├── fileController.js        # File upload/download/delete
└── gameScoreController.js   # Game score persistence
```

### Routes
```
routes/
├── notesRoutes.js          # /api/notes endpoints
├── fileRoutes.js           # /api/files endpoints
└── gameScoresRoutes.js     # /api/game-scores endpoints
```

### Data Storage
```
data/
├── notes.json              # Persistent notes storage
└── gameScores.json         # Game scores leaderboard
```

### File Storage
```
uploads/                    # User uploaded files
```

---

## 🎨 Frontend Architecture

### Pages (Tab-based)
```
pages/
├── Notes.jsx              # Notes manager
└── FileUpload.jsx         # File upload interface
```

### Games
```
games/
├── GamesHub.jsx           # Game selection & leaderboards
├── TypingTest.jsx         # Typing test game
├── MathDots.jsx           # Pattern memory game
└── FlipGrid.jsx           # Flip grid memory game
```

### App Navigation
The app uses a tabbed navigation system:
- 🕐 Home (Clock & Sound)
- 📅 Calendar & Alarm
- 📝 Notes
- 📁 Files
- 🎮 Games

---

## 🚀 Running the Application

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation
```bash
cd alarm
npm install                  # Install root dependencies
cd backend && npm install    # Install backend deps
cd ../front && npm install   # Install frontend deps
```

### Start Development
```bash
cd alarm
npm run dev                  # Runs both backend and frontend
```

**Services:**
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

---

## 📊 Data Models

### Note
```json
{
  "id": 1707302400000,
  "title": "Note Title",
  "content": "Note content",
  "tags": ["tag1", "tag2"],
  "createdAt": "2026-02-07T10:00:00.000Z",
  "updatedAt": "2026-02-07T10:00:00.000Z"
}
```

### GameScore
```json
{
  "id": 1707302400000,
  "playerName": "Player",
  "score": 150,
  "details": {
    "level": 5,
    "mistakes": 3,
    "wordsPerMinute": 45
  },
  "timestamp": "2026-02-07T10:00:00.000Z"
}
```

### UploadedFile
```json
{
  "filename": "unique-id-filename.ext",
  "url": "/uploads/unique-id-filename.ext",
  "size": 1024000,
  "uploadedAt": "2026-02-07T10:00:00.000Z"
}
```

---

## 🔗 API Documentation

### Notes API

**GET /api/notes**
- Returns all notes
- Response: `[{note}, ...]`

**POST /api/notes**
- Create new note
- Body: `{ "title": "...", "content": "...", "tags": ["..."] }`

**PUT /api/notes/:id**
- Update note
- Body: `{ "title": "...", "content": "...", "tags": ["..."] }`

**DELETE /api/notes/:id**
- Delete note
- Response: `{ "message": "Note deleted" }`

### Files API

**POST /api/files**
- Upload file (multipart/form-data)
- Form: `file: <binary>`

**GET /api/files**
- List all uploaded files
- Response: `[{file}, ...]`

**DELETE /api/files/:filename**
- Delete uploaded file

### Game Scores API

**POST /api/game-scores/:gameType**
- Save game score
- Body: `{ "playerName": "...", "score": 100, "details": {...} }`

**GET /api/game-scores/:gameType**
- Get all scores for game type
- Response: `[{score}, ...]`

**GET /api/game-scores/:gameType/high?limit=10**
- Get top scores
- Query: `limit` (default: 10)

---

## 🎯 Feature Alignment

✅ **Notes**
- ✅ Create/Edit/Delete notes
- ✅ Tag organization
- ✅ Search functionality

✅ **File Upload**
- ✅ Upload files
- ✅ Upload images/pictures
- ✅ Download capability
- ✅ File management

✅ **Games**
- ✅ Typing Test (no backspace)
- ✅ Math Dots Pattern
- ✅ Flip Grid Memory
- ✅ Score persistence
- ✅ Leaderboards

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create a note and verify it saves
- [ ] Edit a note and check updates
- [ ] Delete a note with confirmation
- [ ] Search notes by title/tags
- [ ] Upload an image file
- [ ] Download an uploaded file
- [ ] Play Typing Test (60s countdown)
- [ ] Play Math Dots (pattern memory)
- [ ] Play Flip Grid (card matching)
- [ ] Check game scores on leaderboard

---

## 📝 Notes

- All files are stored locally in JSON format
- Uploaded files are stored in `alarm/backend/uploads/`
- Game scores are limited to top 50 per game type
- Images show previews before upload
- No backspacing allowed in Typing Test

---

**Status**: ✅ Complete  
**Last Updated**: February 7, 2026  
**Developed By**: Member 3
