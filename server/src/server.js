require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const startHoldReleaseJob = require('./jobs/releaseExpiredHolds');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  startHoldReleaseJob();
};

startServer();
