/**
 * /users  – unified endpoint for patients and doctors.
 *
 * Patients → type=patient  →  GET/POST/PUT/DELETE /patients  (alias routes below)
 * Doctors  → type=doctor   →  GET/POST/PUT/DELETE /doctors   (alias routes below)
 *
 * The main router is mounted at both /patients and /doctors from server.js,
 * each injecting the correct `type` via req.userType.
 */

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const VALID_BLOOD = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ── POST / ── Create user (patient or doctor) ────────────────────────────────
router.post('/', authenticate, async (req, res) => {
  try {
    const type = req.userType; // 'patient' | 'doctor'
    const b = req.body;

    const required =
      type === 'patient'
        ? ['patient_name', 'age', 'gender', 'wilaya', 'patient_phone']
        : ['doctor_name', 'specialty', 'wilaya'];
    const missing = required.filter((f) => !b[f]);
    if (missing.length)
      return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });

    const blood_type = b.blood_type ? b.blood_type.toUpperCase().trim() : undefined;
    if (blood_type && !VALID_BLOOD.includes(blood_type))
      return res.status(400).json({ message: `Invalid blood_type. Must be one of: ${VALID_BLOOD.join(', ')}` });

    const userData = {
      type,
      full_name: b.patient_name || b.doctor_name || b.full_name,
      phone: b.patient_phone || b.phone || null,
      email: b.email || null,
      username: b.username || null,
      password: b.password ? await bcrypt.hash(b.password, 10) : null,
      wilaya: b.wilaya,
      active: true,
    };

    if (type === 'patient') {
      userData.full_name = b.patient_name || userData.full_name;
      userData.phone = b.patient_phone || userData.phone;
      userData.age = Number(b.age);
      userData.gender = b.gender;
      userData.distance_km = b.distance_km ? Number(b.distance_km) : null;
      userData.payment_type = b.payment_type || 'Cash';
      if (blood_type) userData.blood_type = blood_type;
      if (b.height_cm) userData.height_cm = Number(b.height_cm);
      if (b.weight_kg) userData.weight_kg = Number(b.weight_kg);
      if (userData.height_cm && userData.weight_kg)
        userData.bmi = Math.round((userData.weight_kg / Math.pow(userData.height_cm / 100, 2)) * 10) / 10;
      if (b.allergies) userData.allergies = b.allergies;
      if (b.medical_conditions) userData.medical_conditions = b.medical_conditions;
      if (b.notes) userData.notes = b.notes;
    }

    if (type === 'doctor') {
      userData.full_name = b.doctor_name || userData.full_name;
      userData.specialty = b.specialty;
      userData.clinic_name = b.clinic_name || 'Doctome Clinic';
      userData.available_days = b.available_days || ['Mon', 'Tue', 'Wed', 'Thu'];
      userData.slot_duration_min = Number(b.slot_duration_min) || 30;
      userData.max_daily_patients = Number(b.max_daily_patients) || 20;
      userData.overbooking_allowed = b.overbooking_allowed === true || b.overbooking_allowed === 'true';
    }

    const user = await User.create(userData);
    const { password: _, ...safe } = user.toObject();
    return res.status(201).json(safe);
  } catch (err) {
    console.error('create user error', err);
    return res.status(500).json({ message: err.message });
  }
});

// ── GET / ── List users ──────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const type = req.userType;
    const q = req.query;
    const filter = { type, active: { $ne: false } };
    if (q.wilaya) filter.wilaya = q.wilaya;
    if (q.name) filter.full_name = { $regex: q.name, $options: 'i' };
    if (q.specialty && type === 'doctor') filter.specialty = q.specialty;

    const users = await User.find(filter, { password: 0 }).lean();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── GET /:id ── Single user ──────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const type = req.userType;
    const user = await User.findOne({ _id: req.params.id, type }, { password: 0 });
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── PUT /:id ── Update user ──────────────────────────────────────────────────
router.put('/:id', authenticate, async (req, res) => {
  try {
    const type = req.userType;
    const b = req.body;

    const patientFields = [
      'full_name', 'age', 'gender', 'wilaya', 'phone',
      'email', 'distance_km', 'payment_type', 'blood_type', 'height_cm', 'weight_kg',
      'allergies', 'medical_conditions', 'prior_no_shows', 'prior_visits', 'notes',
    ];
    const doctorFields = [
      'full_name', 'phone', 'email', 'wilaya', 'specialty', 'clinic_name',
      'available_days', 'slot_duration_min', 'max_daily_patients', 'overbooking_allowed',
    ];
    const allowed = type === 'patient' ? patientFields : doctorFields;
    const upd = {};
    for (const k of allowed) {
      if (b[k] !== undefined) upd[k] = b[k];
    }

    // Recalculate BMI if relevant fields updated
    if (upd.height_cm && upd.weight_kg)
      upd.bmi = Math.round((Number(upd.weight_kg) / Math.pow(Number(upd.height_cm) / 100, 2)) * 10) / 10;

    if (b.password) upd.password = await bcrypt.hash(b.password, 10);

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, type },
      { $set: upd },
      { new: true, projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── DELETE /:id ── Soft-delete user ─────────────────────────────────────────
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const type = req.userType;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, type },
      { $set: { active: false } },
      { new: true, projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json({ message: `${type} deactivated`, user_id: user._id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
