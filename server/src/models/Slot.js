const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['open', 'held', 'booked', 'cancelled'],
      default: 'open',
    },
    heldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    heldAt: { type: Date, default: null },
    version: { type: Number, default: 0 },
  },
  { timestamps: true }
);

slotSchema.index({ resourceId: 1, startTime: 1 }, { unique: true });
slotSchema.index({ resourceId: 1, status: 1, startTime: 1 });

module.exports = mongoose.model('Slot', slotSchema);
