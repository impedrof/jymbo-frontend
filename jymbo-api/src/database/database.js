const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_jymbo', 'root', 'Goncomeuocabo2020!', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
