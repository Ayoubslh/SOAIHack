const router = require('express').Router();
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');

// ── GET /notifications ───────────────────────────────────────────────────────
// Fetching ALL notifications without filtering (as requested for the current DB state)
router.get('/', authenticate, async (req, res) => {
  try {
    console.log('Fetching ALL notifications from the database');
    const notifications = await Notification.find({}).sort({ created_at: -1 }).lean();
    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── DELETE /notifications ────────────────────────────────────────────────────
router.delete('/', authenticate, async (req, res) => {
  try {
    await Notification.deleteMany({});
    return res.json({ message: 'All notifications cleared' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── GET /sse/notifications ── Server-Sent Events stream ─────────────────────
router.get('/sse', authenticate, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendPending = async () => {
      // Stream all unread notifications in the system 
      const pending = await Notification.find({ read: false }).lean();
      if (pending.length) {
        for (const n of pending) {
          res.write(`data: ${JSON.stringify(n)}\n\n`);
        }
        await Notification.updateMany(
          { _id: { $in: pending.map((n) => n._id) } },
          { $set: { read: true } }
        );
      }
    };

    await sendPending();
    const interval = setInterval(sendPending, 5000);

    req.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
