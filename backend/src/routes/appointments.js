const router = require('express').Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

function makeAptId() {
  return 'APT-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

// ── POST / ── Create appointment ─────────────────────────────────────────────
router.post('/', authenticate, async (req, res) => {
  try {
    const b = req.body;
    const appointment_id = b.appointment_id || makeAptId();
    const apt = await Appointment.create({ ...b, appointment_id, status: b.status || 'scheduled' });
    return res.status(201).json(apt);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── GET / ── List appointments ───────────────────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const q = req.query;
    const filter = {};
    if (q.date) filter.appointment_date = q.date;
    
    const userId = q.user_id || q.patient_id || q.doctor_id;
    const role = q.role || (req.auth && req.auth.role);

    if (userId) {
      if (role === 'doctor') {
        filter.doctor_id = userId;
      } else {
        filter.patient_id = userId;
      }
    }

    if (q.risk_level) filter.risk_level = q.risk_level.toUpperCase();
    if (q.status) filter.status = q.status;
    if (q.from || q.to) {
      filter.appointment_date = {};
      if (q.from) filter.appointment_date.$gte = q.from;
      if (q.to) filter.appointment_date.$lte = q.to;
    }
    const apts = await Appointment.find(filter).sort({ created_at: -1 }).lean();
    return res.json(apts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── GET /:id ── Single appointment (by User ID) ─────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
  try {
    const role = req.query.role || (req.auth && req.auth.role);
    const filter = role === 'doctor' ? { doctor_id: req.params.id } : { patient_id: req.params.id };
    
    const apt = await Appointment.findOne(filter).sort({ created_at: -1 });
    if (!apt) return res.status(404).json({ message: 'No appointment found for this user' });
    return res.json(apt);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── PUT /:id ── Update appointment (by User ID) ─────────────────────────────
router.put('/:id', authenticate, async (req, res) => {
  try {
    const allowed = [
      'appointment_date', 'appointment_hour', 'specialty', 'status',
      'patient_confirmed', 'patient_declined', 'notes', 'doctor_id', 'clinic_name',
    ];
    const upd = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) upd[k] = req.body[k];
    }
    
    const role = req.query.role || (req.auth && req.auth.role);
    const filter = role === 'doctor' ? { doctor_id: req.params.id } : { patient_id: req.params.id };

    const apt = await Appointment.findOneAndUpdate(
      filter,
      { $set: upd },
      { new: true, sort: { created_at: -1 } }
    );
    if (!apt) return res.status(404).json({ message: 'No appointment found for this user' });
    return res.json(apt);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── DELETE /:id ── Cancel appointment (by User ID) ──────────────────────────
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const role = req.query.role || (req.auth && req.auth.role);
    const filter = role === 'doctor' ? { doctor_id: req.params.id } : { patient_id: req.params.id };

    const apt = await Appointment.findOneAndUpdate(
      filter,
      { $set: { status: 'cancelled', cancelled_at: new Date().toISOString() } },
      { new: true, sort: { created_at: -1 } }
    );
    if (!apt) return res.status(404).json({ message: 'No appointment found for this user' });
    return res.json({ message: 'Appointment cancelled', appointment_id: apt.appointment_id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
