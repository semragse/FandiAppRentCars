const { sequelize, Car, Reservation } = require('./models');

async function verifyTables() {
  try {
    console.log('🔍 Verifying SQLite database tables...\n');
    
    // Sync tables (create if not exist, alter if needed)
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema synchronized\n');
    
    // Get all tables
    const [tables] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    
    console.log('📋 Tables in database:');
    tables.forEach(table => console.log(`  - ${table.name}`));
    console.log('');
    
    // Get car table structure
    const [carColumns] = await sequelize.query("PRAGMA table_info(cars)");
    console.log('🚗 Car table structure:');
    carColumns.forEach(col => {
      console.log(`  - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? '(PRIMARY KEY)' : ''}`);
    });
    console.log('');
    
    // Get reservation table structure
    const [reservationColumns] = await sequelize.query("PRAGMA table_info(reservations)");
    console.log('📅 Reservation table structure:');
    reservationColumns.forEach(col => {
      console.log(`  - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? '(PRIMARY KEY)' : ''}`);
    });
    console.log('');
    
    // Count records
    const carCount = await Car.count();
    const reservationCount = await Reservation.count();
    
    console.log('📊 Record counts:');
    console.log(`  - Cars: ${carCount}`);
    console.log(`  - Reservations: ${reservationCount}`);
    console.log('');
    
    console.log('✅ Database verification complete!');
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyTables();
