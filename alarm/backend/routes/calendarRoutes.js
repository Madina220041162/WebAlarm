const express = require('express');
const calendarController = require('../controllers/calendarController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All calendar routes require authentication
router.get('/', authMiddleware, calendarController.getAllEvents);
router.post('/', authMiddleware, calendarController.createEvent);
router.get('/range', authMiddleware, calendarController.getEventsByDateRange);
router.get('/:id', authMiddleware, calendarController.getEvent);
router.put('/:id', authMiddleware, calendarController.updateEvent);
router.delete('/:id', authMiddleware, calendarController.deleteEvent);

module.exports = router;
