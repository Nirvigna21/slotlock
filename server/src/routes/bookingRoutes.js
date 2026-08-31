const express = require('express');
const {
  createBooking,
  cancelBooking,
  getMyBookings,
  joinWaitlist,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBooking);
router.delete('/:id', protect, cancelBooking);
router.get('/me', protect, getMyBookings);
router.post('/waitlist', protect, joinWaitlist);

module.exports = router;
