const mongoose = require('mongoose');

const clickLogSchema = new mongoose.Schema({
  shortCode: { type: String, required: true },
  ip: { type: String },
  location: { type: Object },
  clickedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClickLog', clickLogSchema);
