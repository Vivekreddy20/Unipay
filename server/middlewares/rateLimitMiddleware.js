const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  trustProxy: true,
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many requests, please try again after 15 minutes."
    });
  }
});

module.exports = limiter;
