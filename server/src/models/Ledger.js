const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    action: {
      type: String,
      enum: ['booked', 'cancelled', 'hold_expired'],
      required: true,
    },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

ledgerSchema.index({ bookingId: 1, createdAt: 1 });

module.exports = mongoose.model('Ledger', ledgerSchema);
