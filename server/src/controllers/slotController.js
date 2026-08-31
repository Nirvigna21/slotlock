const Slot = require('../models/Slot');
const Resource = require('../models/Resource');

const generateSlots = async (req, res) => {
  try {
    const { resourceId, date, startHour, endHour } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    if (resource.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your resource' });
    }

    const durationMins = resource.slotDurationMins;
    const slotsToCreate = [];

    let current = new Date(`${date}T${String(startHour).padStart(2, '0')}:00:00`);
    const end = new Date(`${date}T${String(endHour).padStart(2, '0')}:00:00`);

    while (current < end) {
      const slotEnd = new Date(current.getTime() + durationMins * 60000);
      if (slotEnd > end) break;

      slotsToCreate.push({
        resourceId,
        startTime: new Date(current),
        endTime: slotEnd,
      });

      current = slotEnd;
    }

    const created = await Slot.insertMany(slotsToCreate, { ordered: false }).catch((err) => {
      return err.insertedDocs || [];
    });

    res.status(201).json({
      requested: slotsToCreate.length,
      created: Array.isArray(created) ? created.length : 0,
      slots: created,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSlotsByResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { date } = req.query;

    const filter = { resourceId };

    if (date) {
      const dayStart = new Date(`${date}T00:00:00`);
      const dayEnd = new Date(`${date}T23:59:59`);
      filter.startTime = { $gte: dayStart, $lte: dayEnd };
    }

    const slots = await Slot.find(filter).sort({ startTime: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateSlots, getSlotsByResource };
