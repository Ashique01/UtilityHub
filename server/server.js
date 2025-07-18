require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const urlRoutes = require('./routes/urlRoutes');
const pingRoutes = require('./routes/pingRoutes');

const app = express();

const allowedOrigins = [
  'https://linkping.netlify.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-token'],
}));

app.use(express.json());
app.use(morgan('combined'));

app.use('/api/url', urlRoutes);
app.use('/api/ping', pingRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
