const CalendarEvent = require('../models/CalendarEvent');

// Get all events for current user
exports.getAllEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const events = await CalendarEvent.find({ userId }).sort({ startDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Error reading events', error: error.message });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, startDate, endDate, color, isAllDay, reminder, reminderTime } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, startDate, and endDate are required' });
    }

    const newEvent = new CalendarEvent({
      userId,
      title,
      description: description || '',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      color: color || '#667eea',
      isAllDay: isAllDay || false,
      reminder: reminder !== undefined ? reminder : true,
      reminderTime: reminderTime || 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created', event: newEvent });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// Get a single event
exports.getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const event = await CalendarEvent.findOne({ _id: id, userId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Error retrieving event', error: error.message });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, description, startDate, endDate, color, isAllDay, reminder, reminderTime } = req.body;

    const event = await CalendarEvent.findOne({ _id: id, userId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (startDate !== undefined) event.startDate = new Date(startDate);
    if (endDate !== undefined) event.endDate = new Date(endDate);
    if (color !== undefined) event.color = color;
    if (isAllDay !== undefined) event.isAllDay = isAllDay;
    if (reminder !== undefined) event.reminder = reminder;
    if (reminderTime !== undefined) event.reminderTime = reminderTime;
    event.updatedAt = new Date();

    await event.save();
    res.status(200).json({ message: 'Event updated', event });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const event = await CalendarEvent.findOneAndDelete({ _id: id, userId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

// Get events for a specific date range
exports.getEventsByDateRange = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    const events = await CalendarEvent.find({
      userId,
      $or: [
        { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }
      ]
    }).sort({ startDate: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error('Get events by date range error:', error);
    res.status(500).json({ message: 'Error retrieving events', error: error.message });
  }
};
