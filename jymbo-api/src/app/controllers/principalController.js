const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Movimentacao = require('../models/movimentacao');

const router = express.Router();

router.use(authMiddleware);

router.get('/:idUser', (req, res) => {
  Movimentacao.findAll({ where: { usuarioId: req.params.idUser } }).then(mov => {
    res.send(mov);
  });
});

module.exports = router;
