const express = require("express");
const notesController = require("../controllers/notesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All notes routes require authentication
router.get("/", authMiddleware, notesController.getAllNotes);
router.post("/", authMiddleware, notesController.createNote);
router.get("/:id", authMiddleware, notesController.getNote);
router.put("/:id", authMiddleware, notesController.updateNote);
router.delete("/:id", authMiddleware, notesController.deleteNote);

module.exports = router;
