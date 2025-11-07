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
  try {
    // Try to load sqlite3, it might not be available in production
    require('sqlite3');
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: process.env.SQLITE_STORAGE || 'fandicars.db',
      logging: false,
    });
  } catch (error) {
    console.error('⚠️ SQLite3 not available and DATABASE_URL not set');
    console.error('Please set DATABASE_URL environment variable for PostgreSQL');
    process.exit(1);
  }
}

const Car = require('./car')(sequelize);
const Reservation = require('./reservation')(sequelize);
const Setting = require('./setting')(sequelize);
const PaymentSettings = require('./paymentSettings')(sequelize);

// Associations
Car.hasMany(Reservation, { foreignKey: 'carId', onDelete: 'CASCADE' });
Reservation.belongsTo(Car, { foreignKey: 'carId' });

module.exports = { sequelize, Car, Reservation, Setting, PaymentSettings };