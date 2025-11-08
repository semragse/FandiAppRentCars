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
    console.error('');
    console.error('❌ DATABASE CONFIGURATION ERROR');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('⚠️  SQLite3 is not available in this environment');
    console.error('⚠️  DATABASE_URL environment variable is not set');
    console.error('');
    console.error('📋 TO FIX THIS ON RAILWAY:');
    console.error('   1. Go to your Railway project');
    console.error('   2. Click "+ New"');
    console.error('   3. Select "Database"');
    console.error('   4. Choose "Add PostgreSQL"');
    console.error('   5. Railway will automatically set DATABASE_URL');
    console.error('');
    console.error('📖 See RAILWAY_SETUP.md for detailed instructions');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('');
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