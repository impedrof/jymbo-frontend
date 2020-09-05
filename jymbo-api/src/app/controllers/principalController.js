const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { JsonWebTokenError } = require('jsonwebtoken');
const authConfig = require('../../util/auth.json');

const router = express.Router();

router.use(authMiddleware);

router.get('', (req, res) => {
  res.send({ ok: true, userId: req.userId });
});

module.exports = router;
