const Url = require('../models/Url');
const ClickLog = require('../models/ClickLog');
const { nanoid } = require('nanoid');
const geoip = require('geoip-lite');

// POST /api/url/shorten
exports.shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) return res.status(400).json({ message: 'URL is required' });

  try {
    let shortCode = nanoid(6);
    const url = await Url.create({ originalUrl, shortCode });
    res.status(201).json({
      originalUrl,
      shortUrl: `${req.protocol}://${req.get('host')}/api/url/${shortCode}`,
      shortCode
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// GET /api/url/:code
exports.redirectUrl = async (req, res) => {
  const { code } = req.params;
  try {
    const url = await Url.findOne({ shortCode: code });
    if (!url) return res.status(404).json({ message: 'URL not found' });

    url.clicks += 1;
    await url.save();

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);

    await ClickLog.create({ shortCode: code, ip, location: geo });

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// GET /api/url/stats/:code
exports.getUrlStats = async (req, res) => {
  const { code } = req.params;
  try {
    const url = await Url.findOne({ shortCode: code });
    if (!url) return res.status(404).json({ message: 'URL not found' });

    const logs = await ClickLog.find({ shortCode: code }).sort({ clickedAt: -1 });

    res.status(200).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      totalClicks: url.clicks,
      logs
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


// GET /api/url/admin/all
exports.getAllUrls = async (req, res) => {
  try {
  
    const urls = await Url.find().sort({ createdAt: -1 });
    res.status(200).json({ urls });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};