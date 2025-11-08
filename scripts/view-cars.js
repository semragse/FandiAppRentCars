const { Car } = require('../backend/models');

async function viewCars() {
  try {
    const cars = await Car.findAll({
      order: [['id', 'ASC']]
    });
    
    console.log('\n🚗 CARS IN DATABASE:\n');
    console.log('═'.repeat(80));
    
    cars.forEach(car => {
      console.log(`\n📌 ${car.name} (${car.id})`);
      console.log(`   💰 Price: ${car.price}€/jour`);
      console.log(`   🚗 Type: ${car.carType || 'N/A'}`);
      console.log(`   📍 Agency: ${car.locationAgency}`);
      console.log(`   🖼️  Image: ${car.image}`);
      console.log(`   👥 Seats: ${car.seats || 5}`);
      console.log(`   ⛽ Fuel: ${car.fuelType || 'Essence SP'}`);
      console.log(`   ⚙️  Transmission: ${car.transmission || 'Automatique'}`);
    });
    
    console.log('\n' + '═'.repeat(80));
    console.log(`\n✅ Total: ${cars.length} cars\n`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

viewCars();
