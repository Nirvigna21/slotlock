const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema(
  {
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    position: { type: Number, required: true },
    notifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

waitlistSchema.index({ slotId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Waitlist', waitlistSchema);
