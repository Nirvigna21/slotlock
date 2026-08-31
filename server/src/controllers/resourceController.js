const Resource = require('../models/Resource');

const createResource = async (req, res) => {
  try {
    const { name, category, location, capacity, slotDurationMins } = req.body;

    const resource = await Resource.create({
      ownerId: req.user._id,
      name,
      category,
      location,
      capacity,
      slotDurationMins,
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResources = async (req, res) => {
  try {
    const { category, location } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;
    if (location) filter.location = location;

    const resources = await Resource.find(filter);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    if (resource.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your resource' });
    }

    Object.assign(resource, req.body);
    await resource.save();

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createResource, getResources, getResourceById, updateResource };
