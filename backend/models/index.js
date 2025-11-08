const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Decide which database to use based on presence of DATABASE_URL
const hasPostgres = !!process.env.DATABASE_URL;
let sequelize;

if (hasPostgres) {
  console.log('� Using PostgreSQL via DATABASE_URL');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: process.env.DATABASE_SSL === 'true'
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
    logging: false
  });
} else {
  const storagePath = process.env.SQLITE_STORAGE || path.join(process.cwd(), 'fandicars.db');
  console.log('📁 Using SQLite database at', storagePath);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
  });
}

const Car = require('./car')(sequelize);
const Reservation = require('./reservation')(sequelize);
const Setting = require('./setting')(sequelize);
const PaymentSettings = require('./paymentSettings')(sequelize);

// Associations
Car.hasMany(Reservation, { foreignKey: 'carId', onDelete: 'CASCADE' });
Reservation.belongsTo(Car, { foreignKey: 'carId' });

// Small helper to print a connection summary when authenticated elsewhere
sequelize.connectionSummary = () => {
  return {
    dialect: sequelize.getDialect(),
    urlProvided: hasPostgres,
    storage: sequelize.options.storage || null,
    ssl: !!(sequelize.options.dialectOptions && sequelize.options.dialectOptions.ssl)
  };
};

module.exports = { sequelize, Car, Reservation, Setting, PaymentSettings };