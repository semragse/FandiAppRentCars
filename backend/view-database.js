const { sequelize, Car, Reservation } = require('./models');

async function viewDatabaseData() {
  try {
    console.log('🔍 Viewing SQLite database data...\n');

    // Get all cars
    const cars = await Car.findAll({
      order: [['name', 'ASC']]
    });

    console.log('🚗 CARS TABLE:');
    console.log('═'.repeat(80));
    cars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.name}`);
      console.log(`   ID: ${car.id}`);
      console.log(`   Price: ${car.price} DH/jour`);
      console.log(`   Location: ${car.locationAgency}`);
      console.log(`   Image: ${car.image}`);
      console.log('');
    });

    // Get all reservations
    const reservations = await Reservation.findAll({
      order: [['startDate', 'ASC']],
      include: [{
        model: Car,
        attributes: ['name']
      }]
    });

    console.log('📅 RESERVATIONS TABLE:');
    console.log('═'.repeat(80));
    reservations.forEach((reservation, index) => {
      console.log(`${index + 1}. ${reservation.customerName} - ${reservation.Car.name}`);
      console.log(`   ID: ${reservation.id}`);
      console.log(`   Dates: ${reservation.startDate} → ${reservation.endDate}`);
      console.log(`   Agencies: ${reservation.departureAgency} → ${reservation.returnAgency}`);
      console.log(`   Contact: ${reservation.customerEmail} | ${reservation.customerPhone}`);
      console.log(`   Price: ${reservation.totalPrice} DH`);
      if (reservation.notes) {
        console.log(`   Notes: ${reservation.notes}`);
      }
      console.log('');
    });

    console.log('📊 SUMMARY:');
    console.log(`  - Total Cars: ${cars.length}`);
    console.log(`  - Total Reservations: ${reservations.length}`);
    console.log('');

    await sequelize.close();
    console.log('✅ Database view completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

viewDatabaseData();
