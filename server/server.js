require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const urlRoutes = require('./routes/urlRoutes');
const pingRoutes = require('./routes/pingRoutes');

const app = express();

// Middleware
app.use(cors({ origin: "https://linkping.netlify.app" })); 
app.use(express.json());
app.use(morgan('tiny'));

// Routes
app.use('/api/url', urlRoutes);
app.use('/api/ping', pingRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start server only after DB is connected
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

