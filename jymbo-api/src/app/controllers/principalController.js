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

router.post('/cadastrar', async (req, res) => {
  const novaMovimentacao = req.body;
  try {
    const mov = await Movimentacao.create({
      tipo: novaMovimentacao.tipo,
      descricao: novaMovimentacao.descricao,
      valor: novaMovimentacao.valor,
      data: novaMovimentacao.data,
      usuarioId: novaMovimentacao.usuarioId
    })
    res.send(mov);
  } catch(err) {
    return res.status(400).send({ error: 'Erro ao tentar cadastrar movimentação.' });
  }
  
});

module.exports = router;
