const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const SECRET = process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION';
const EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 86400;
const VALID_TYPES = ['patient', 'doctor', 'staff', 'admin'];
const VALID_BLOOD = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function issueToken(user) {
  const payload = { sub: user._id.toString(), role: user.type };
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

// ── POST /auth/signup ────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const b = req.body;
    const missing = ['username', 'password', 'type'].filter((f) => !b[f]);
    if (missing.length)
      return res.status(400).json({ message: `Missing: ${missing.join(', ')}` });

    if (!VALID_TYPES.includes(b.type))
      return res.status(400).json({ message: `type must be one of: ${VALID_TYPES.join(', ')}` });

    const exists = await User.findOne({ username: b.username });
    if (exists) return res.status(409).json({ message: 'Username already taken' });

    const hashed = await bcrypt.hash(b.password, 10);

    const blood_type = b.blood_type ? b.blood_type.toUpperCase().trim() : undefined;
    if (blood_type && !VALID_BLOOD.includes(blood_type))
      return res.status(400).json({ message: `Invalid blood_type. Must be one of: ${VALID_BLOOD.join(', ')}` });

    const userData = {
      type: b.type,
      username: b.username,
      password: hashed,
      full_name: b.full_name || b.patient_name || b.doctor_name || null,
      email: b.email || null,
      phone: b.phone || b.patient_phone || null,
      wilaya: b.wilaya || null,
      active: true,
    };

    if (b.type === 'patient') {
      if (b.age !== undefined) userData.age = Number(b.age);
      if (b.gender) userData.gender = b.gender;
      if (b.distance_km !== undefined) userData.distance_km = Number(b.distance_km);
      if (b.payment_type) userData.payment_type = b.payment_type;
      if (blood_type) userData.blood_type = blood_type;
      if (b.height_cm !== undefined) userData.height_cm = Number(b.height_cm);
      if (b.weight_kg !== undefined) userData.weight_kg = Number(b.weight_kg);
      if (userData.height_cm && userData.weight_kg)
        userData.bmi = Math.round((userData.weight_kg / Math.pow(userData.height_cm / 100, 2)) * 10) / 10;
    }

    if (b.type === 'doctor') {
      if (b.specialty) userData.specialty = b.specialty;
      if (b.clinic_name) userData.clinic_name = b.clinic_name;
      if (b.available_days) userData.available_days = b.available_days;
      if (b.slot_duration_min !== undefined) userData.slot_duration_min = Number(b.slot_duration_min);
      if (b.max_daily_patients !== undefined) userData.max_daily_patients = Number(b.max_daily_patients);
      if (b.overbooking_allowed !== undefined)
        userData.overbooking_allowed = b.overbooking_allowed === true || b.overbooking_allowed === 'true';
    }

    const user = await User.create(userData);
    const token = issueToken(user);

    const { password: _, ...safeUser } = user.toObject();
    return res.status(201).json({ token, expires_in: EXPIRES_IN, user: safeUser });
  } catch (err) {
    console.error('signup error', err);
    return res.status(500).json({ message: err.message });
  }
});

// ── POST /auth/login ─────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'username and password required' });

    const user = await User.findOne({ username, active: { $ne: false } }).lean();
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = issueToken(user);
    
    // Explicitly select fields based on user type
    const base = {
      token,
      expires_in: EXPIRES_IN,
      user_id: user._id.toString(),
      role: user.type,
      full_name: user.full_name,
      phone: user.phone,
      email: user.email,
      wilaya: user.wilaya
    };

    console.log(`Login attempt: user=${username}, type=${user.type}`);

    if (user.type === 'patient') {
      return res.json({
        ...base,
        age: user.age,
        gender: user.gender,
        payment_type: user.payment_type,
        blood_type: user.blood_type,
        height_cm: user.height_cm,
        weight_kg: user.weight_kg,
        bmi: user.bmi,
        allergies: user.allergies,
        medical_conditions: user.medical_conditions,
        prior_no_shows: user.prior_no_shows,
        prior_visits: user.prior_visits,
        notes: user.notes
      });
    } else if (user.type === 'doctor') {
      return res.json({
        ...base,
        specialty: user.specialty,
        clinic_name: user.clinic_name,
        available_days: user.available_days,
        slot_duration_min: user.slot_duration_min,
        max_daily_patients: user.max_daily_patients,
        overbooking_allowed: user.overbooking_allowed
      });
    }

    // Default response for other roles (staff, admin, etc.)
    return res.json(base);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── GET /auth/me ─────────────────────────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── POST /auth/refresh ───────────────────────────────────────────────────────
router.post('/refresh', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });
    const token = issueToken(user);
    return res.json({ token, expires_in: EXPIRES_IN, role: user.type });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
