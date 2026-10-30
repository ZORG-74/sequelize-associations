const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Author = sequelize.define('Author', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'authors',
  timestamps: true,
});

module.exports = Author;