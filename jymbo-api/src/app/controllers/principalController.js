const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Movimentacao = require('../models/movimentacao');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models/movimentacao');

const router = express.Router();

router.use(authMiddleware);

router.get('/:idUser/:dataAtual', async (req, res) => {
  console.log(req.params.dataAtual);
  const dataAtual = new Date(req.params.dataAtual);
  const mes = `${dataAtual.getMonth() + 1}`;
  const ano = `${dataAtual.getFullYear()}`;
  const query = `SELECT * FROM movimentacaos WHERE usuarioId = :idUsuario AND MONTH(data) = :mes AND YEAR(data) = :ano`;
  const mov = await sequelize.query(query, { type: QueryTypes.SELECT, replacements: { idUsuario: req.params.idUser, mes: mes, ano: ano }});
  res.send(mov);
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
