require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRoutes         = require('./routes/auth');
const usersRoutes        = require('./routes/users');
const appointmentRoutes  = require('./routes/appointments');
const dashboardRoutes    = require('./routes/dashboard');
const notificationRoutes = require('./routes/notifications');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optional: CORS for local dev
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────

// Auth
app.use('/auth', authRoutes);

// Patients → inject userType='patient' then use shared users router
app.use('/patients', (req, _res, next) => { req.userType = 'patient'; next(); }, usersRoutes);

// Doctors → inject userType='doctor' then use shared users router
app.use('/doctors', (req, _res, next) => { req.userType = 'doctor'; next(); }, usersRoutes);

// Appointments
app.use('/appointments', appointmentRoutes);

// Dashboard
app.use('/dashboard', dashboardRoutes);

// Notifications (REST + SSE)
app.use('/notifications', notificationRoutes);
app.use('/sse/notifications', (req, res, next) => {
  // forward SSE to the /notifications/sse handler by rewriting path
  req.url = '/sse';
  notificationRoutes(req, res, next);
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// ── MongoDB + Start ───────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/doctome')
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => console.log(`🚀  Doctome API listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
