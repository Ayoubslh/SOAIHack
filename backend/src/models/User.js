const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────
    // user_id, patient_id, and doctor_id removed as they are 
    // redundant. The _id (ObjectId) and type are used instead.
    type: {
      type: String,
      enum: ['patient', 'doctor', 'staff', 'admin'],
      default: 'patient',
    },
    username: { type: String, sparse: true },
    password: { type: String },
    full_name: { type: String },
    email: { type: String },
    phone: { type: String },
    wilaya: { type: String },
    active: { type: Boolean, default: true },

    // ── Patient-specific (optional) ───────────────────────────
    age: { type: Number },
    gender: { type: String },
    distance_km: { type: Number },
    payment_type: { type: String, default: 'Cash' },
    blood_type: { type: String },
    height_cm: { type: Number },
    weight_kg: { type: Number },
    bmi: { type: Number },
    allergies: { type: String },
    medical_conditions: { type: String },
    prior_no_shows: { type: Number, default: 0 },
    prior_visits: { type: Number, default: 0 },
    notes: { type: String },

    // ── Doctor-specific (optional) ────────────────────────────
    specialty: { type: String },
    clinic_name: { type: String, default: 'Doctome Clinic' },
    available_days: { type: [String], default: undefined },
    slot_duration_min: { type: Number },
    max_daily_patients: { type: Number },
    overbooking_allowed: { type: Boolean },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'users',
  }
);

// ── Indexes ──
userSchema.index({ type: 1 });
userSchema.index({ username: 1 }, { sparse: true });
userSchema.index({ wilaya: 1 });
userSchema.index({ specialty: 1 }, { sparse: true });

module.exports = mongoose.model('User', userSchema);
