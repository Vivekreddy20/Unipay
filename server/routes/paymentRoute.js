// paymentRoute.js
const express = require('express');
const { checkout, paymentVerification } = require('../controllers/paymentcontroller.js');
const authenticateJWT = require('../middlewares/authMiddleware.js');


const router = express.Router();

router.route("/checkout").post(authenticateJWT, checkout);
router.route("/paymentverification").post(authenticateJWT, paymentVerification);

module.exports = router;
