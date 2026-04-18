const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // The recipient of the notification (Patient or Doctor)
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    type: { type: String }, // 'score', 'confirmation', 'cancellation', etc.
    message: { type: String },
    appointment_id: { type: String },
    
    // Additional context
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    patient_name: { type: String },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    risk_level: { type: String },
    no_show_probability: { type: Number },
    top_risk_drivers: { type: [String] },
    appointment_date: { type: String },
    specialty: { type: String },
    action: { type: String },
    offer_id: { type: String },
    
    read: { type: Boolean, default: false },
    timestamp: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'notifications',
  }
);

notificationSchema.index({ user_id: 1 });
notificationSchema.index({ read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
