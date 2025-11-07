const { Sequelize } = require('sequelize');
require('dotenv').config();

// Auto-detect database configuration
// Railway provides DATABASE_URL for PostgreSQL
// Local development uses SQLite
let sequelize;

if (process.env.DATABASE_URL) {
  // Production: Use PostgreSQL from Railway
  console.log('🐘 Using PostgreSQL database');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
  });
} else {
  // Development: Use SQLite
  console.log('📁 Using SQLite database');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || 'fandicars.db',
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

module.exports = { sequelize, Car, Reservation, Setting, PaymentSettings };