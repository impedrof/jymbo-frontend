const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_jymbo', 'root', 'goncomeuocabo2020', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
