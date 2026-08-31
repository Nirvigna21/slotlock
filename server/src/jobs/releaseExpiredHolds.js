const cron = require('node-cron');
const Slot = require('../models/Slot');

const startHoldReleaseJob = () => {
  cron.schedule('*/1 * * * *', async () => {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const result = await Slot.updateMany(
      { status: 'held', heldAt: { $lt: twoMinutesAgo } },
      { $set: { status: 'open', heldBy: null, heldAt: null } }
    );

    if (result.modifiedCount > 0) {
      console.log(`Released ${result.modifiedCount} expired held slot(s)`);
    }
  });
};

module.exports = startHoldReleaseJob;
