const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');

const MovimentacaoSchema = sequelize.define('movimentacao', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    tipo: { type: DataTypes.INTEGER, allowNull: false},
    descricao: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.DOUBLE(10,2), allowNull: false },
    data: { type: DataTypes.DATE, allowNull: false }
});

module.exports = MovimentacaoSchema;