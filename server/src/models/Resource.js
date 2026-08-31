const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String },
    capacity: { type: Number, default: 1 },
    slotDurationMins: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
