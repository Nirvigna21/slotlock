const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const resourceRoutes = require('./routes/resourceRoutes');
app.use('/api/resources', resourceRoutes);

const slotRoutes = require('./routes/slotRoutes');
app.use('/api/slots', slotRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SlotLock API is running' });
});

module.exports = app;
