const express = require('express');
const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
} = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getResources);
router.get('/:id', getResourceById);
router.post('/', protect, authorize('owner', 'admin'), createResource);
router.put('/:id', protect, authorize('owner', 'admin'), updateResource);

module.exports = router;
