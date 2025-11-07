/**
 * Test SQLite Connection
 * This script verifies that SQLite is properly configured and creates the fandicars.db database
 */

const { sequelize, Car, Reservation } = require('./models');

async function testConnection() {
  try {
    console.log('🔌 Testing SQLite connection...');
    
    // Test authentication
    await sequelize.authenticate();
    console.log('✅ SQLite connection established successfully!');
    
    // Show database info
    console.log('\n📊 Database Information:');
    console.log('  - Database Type:', sequelize.getDialect());
    console.log('  - Database File:', sequelize.options.storage);
    
    // Sync models (create tables)
    console.log('\n🔄 Syncing database schema...');
    await sequelize.sync({ alter: true });
    console.log('✅ Tables created/updated successfully!');
    
    // Show table information
    const [carCount, reservationCount] = await Promise.all([
      Car.count(),
      Reservation.count()
    ]);
    
    console.log('\n📋 Table Status:');
    console.log('  - Cars table: Created (' + carCount + ' records)');
    console.log('  - Reservations table: Created (' + reservationCount + ' records)');
    
    console.log('\n✅ SQLite is configured correctly and ready to use!');
    console.log('   Database file: fandicars.db');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
    console.log('\n🔒 Connection closed.');
  }
}

testConnection();
