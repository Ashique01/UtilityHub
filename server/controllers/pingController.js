const ping = require('ping');

// POST /api/ping
exports.checkPing = async (req, res) => {
  const { host } = req.body;

  if (!host) return res.status(400).json({ message: 'Host is required' });

  try {
    const result = await ping.promise.probe(host, {
      timeout: 5,
    });

    res.status(200).json({
      host: result.host,
      alive: result.alive,
      time: result.time,
      output: result.output
    });
  } catch (err) {
    res.status(500).json({ message: 'Ping failed', error: err.message });
  }
};
