const express = require('express');
const { generateSlots, getSlotsByResource } = require('../controllers/slotController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', protect, authorize('owner', 'admin'), generateSlots);
router.get('/resource/:resourceId', getSlotsByResource);

module.exports = router;
