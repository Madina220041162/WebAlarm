const UserSettings = require('../models/UserSettings');

// Get user settings
exports.getSettings = async (req, res) => {
  try {
    const userId = req.userId;
    let settings = await UserSettings.findOne({ userId });

    // If no settings exist, create default ones
    if (!settings) {
      settings = new UserSettings({ userId });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
};

// Update user settings
exports.updateSettings = async (req, res) => {
  try {
    const userId = req.userId;
    const { theme, fontSize, notifications, soundEnabled, language } = req.body;

    let settings = await UserSettings.findOne({ userId });

    if (!settings) {
      settings = new UserSettings({ userId });
    }

    // Update only provided fields
    if (theme) settings.theme = theme;
    if (fontSize) settings.fontSize = fontSize;
    if (notifications !== undefined) settings.notifications = notifications;
    if (soundEnabled !== undefined) settings.soundEnabled = soundEnabled;
    if (language) settings.language = language;

    settings.updatedAt = Date.now();
    await settings.save();

    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};
