const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    appointment_id: { type: String, required: true, unique: true },
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    patient_name: { type: String },
    patient_phone: { type: String },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    clinic_name: { type: String, default: 'Doctome Clinic' },
    specialty: { type: String, default: 'General Practice' },
    wilaya: { type: String },
    appointment_date: { type: String },
    appointment_hour: { type: Number, default: 10 },
    booked_date: { type: String },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'cancelled', 'completed', 'no_show'],
      default: 'scheduled',
    },
    // Patient snapshot
    age: { type: Number },
    gender: { type: String },
    distance_km: { type: Number },
    payment_type: { type: String, default: 'Cash' },
    prior_no_shows: { type: Number, default: 0 },
    prior_visits: { type: Number, default: 0 },
    is_first_visit: { type: Number, default: 0 },
    reminder_sent: { type: Boolean, default: false },
    reminder_2h_sent: { type: Boolean, default: false },
    reschedule_offer_sent: { type: Boolean, default: false },
    // No-show scoring
    weather: { type: String },
    temperature_c: { type: Number },
    lead_days: { type: Number },
    day_of_week: { type: Number },
    no_show_probability: { type: Number },
    risk_level: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
    risk_score: { type: Number },
    top_risk_drivers: { type: [String] },
    action: { type: String },
    // Confirmation
    patient_confirmed: { type: Boolean },
    patient_declined: { type: Boolean },
    confirmed_at: { type: String },
    cancelled_at: { type: String },
    notes: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'appointments',
  }
);

appointmentSchema.index({ appointment_date: 1 });
appointmentSchema.index({ patient_id: 1 });
appointmentSchema.index({ doctor_id: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ risk_level: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
