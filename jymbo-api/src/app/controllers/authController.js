const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const authConfig = require('../../util/auth.json');

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
}

router.post('/cadastrar', async (req, res) => {
  const emailBody = req.body.email;
  try {
    if (await User.findOne({ where: { email: emailBody } })) {
      return res.status(400).send({ error: 'Email já registrado.' });
    }

    const user = await User.create(req.body);

    user.senha = undefined;

    return res.send({ user, token: generateToken({ id: user.id }) });
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao tentar cadastrar usuário.' });
  }
});

router.post('/autenticar', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).send({ error: 'Usuário não encontrado.' });
    }

    if (!(await bcrypt.compare(senha, user.senha))) {
      return res.status(404).send({ error: 'Senha incorreta' });
    }

    user.senha = undefined;

    res.send({ user, token: generateToken({ id: user.id }) });
  } catch (err) {
    return res.status(500).send({ error: 'Erro tentar logar' });
  }
});

router.get('/user', (req, res) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) return res.status(401).send({ error: 'Não autorizado' });

  const parts = authHeader.split(' ');

  if (parts.length !== 2)
    return res.status(401).send({ error: 'Erro no token' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: 'Token incorreto' });

  jwt.verify(token, authConfig.secret, async (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Token inválido' });
    const id = decoded.id;
    User.findOne({ where: { id: id } }).then((user) => {
      if (!user) {
        return res.status(404).send({ error: 'Usuário não encontrado' });
      }

      user.senha = undefined;

      return res.send({ user, token: generateToken({ id: user.id }) });
    });
  });
});

module.exports = router;
