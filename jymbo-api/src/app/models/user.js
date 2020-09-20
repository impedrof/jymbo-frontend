const Sequelize = require('sequelize');
const sequelize = require('../../database/database');
const bcrypt = require('bcryptjs');

const UserSchema = sequelize.define('usuario', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  nome: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false },
  senha: { type: Sequelize.STRING, allowNull: false },
  cpf: { type: Sequelize.STRING, allowNull: false }
});

UserSchema.beforeCreate(async (user, options) => {
  const hash = await bcrypt.hash(user.senha, 10);
  user.senha = hash;
});

module.exports = UserSchema;
