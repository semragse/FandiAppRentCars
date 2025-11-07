const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use SQLite for all environments
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.SQLITE_STORAGE || 'fandicars.db',
  logging: false,
});

const Car = require('./car')(sequelize);
const Reservation = require('./reservation')(sequelize);
const Setting = require('./setting')(sequelize);
const PaymentSettings = require('./paymentSettings')(sequelize);

// Associations
Car.hasMany(Reservation, { foreignKey: 'carId', onDelete: 'CASCADE' });
Reservation.belongsTo(Car, { foreignKey: 'carId' });

module.exports = { sequelize, Car, Reservation, Setting, PaymentSettings };