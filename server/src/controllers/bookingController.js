const mongoose = require('mongoose');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const Ledger = require('../models/Ledger');
const Waitlist = require('../models/Waitlist');

const createBooking = async (req, res) => {
  const { slotId, idempotencyKey } = req.body;

  if (!slotId || !idempotencyKey) {
    return res.status(400).json({ message: 'slotId and idempotencyKey are required' });
  }

  const existing = await Booking.findOne({ idempotencyKey });
  if (existing) {
    return res.status(200).json({ message: 'Booking already processed', booking: existing });
  }

  const session = await mongoose.startSession();

  try {
    let bookingResult = null;

    await session.withTransaction(async () => {
      const slot = await Slot.findOneAndUpdate(
        { _id: slotId, status: 'open' },
        {
          $set: { status: 'held', heldBy: req.user._id, heldAt: new Date() },
          $inc: { version: 1 },
        },
        { new: true, session }
      );

      if (!slot) {
        throw new Error('SLOT_UNAVAILABLE');
      }

      const bookingDocs = await Booking.create(
        [
          {
            slotId: slot._id,
            resourceId: slot.resourceId,
            userId: req.user._id,
            status: 'confirmed',
            idempotencyKey,
          },
        ],
        { session }
      );
      const booking = bookingDocs[0];

      await Slot.updateOne(
        { _id: slot._id },
        { $set: { status: 'booked' } },
        { session }
      );

      await Ledger.create(
        [
          {
            bookingId: booking._id,
            slotId: slot._id,
            action: 'booked',
            actorId: req.user._id,
            metadata: { idempotencyKey },
          },
        ],
        { session }
      );

      bookingResult = booking;
    });

    res.status(201).json({ message: 'Booking confirmed', booking: bookingResult });
  } catch (error) {
    if (error.message === 'SLOT_UNAVAILABLE') {
      return res.status(409).json({ message: 'Slot no longer available' });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Duplicate booking request' });
    }
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Already cancelled' });
    }

    await session.withTransaction(async () => {
      booking.status = 'cancelled';
      booking.cancelledAt = new Date();
      await booking.save({ session });

      await Slot.updateOne(
        { _id: booking.slotId },
        { $set: { status: 'open', heldBy: null, heldAt: null } },
        { session }
      );

      await Ledger.create(
        [
          {
            bookingId: booking._id,
            slotId: booking.slotId,
            action: 'cancelled',
            actorId: req.user._id,
          },
        ],
        { session }
      );

      const nextInLine = await Waitlist.findOne({ slotId: booking.slotId }).sort({ position: 1 });
      if (nextInLine) {
        nextInLine.notifiedAt = new Date();
        await nextInLine.save({ session });
      }
    });

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('slotId resourceId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinWaitlist = async (req, res) => {
  try {
    const { slotId } = req.body;
    const count = await Waitlist.countDocuments({ slotId });

    const entry = await Waitlist.create({
      slotId,
      userId: req.user._id,
      position: count + 1,
    });

    res.status(201).json(entry);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Already on waitlist for this slot' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, cancelBooking, getMyBookings, joinWaitlist };
