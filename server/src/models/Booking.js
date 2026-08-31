const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    idempotencyKey: { type: String, required: true, unique: true },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
