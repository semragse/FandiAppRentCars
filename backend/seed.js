const { sequelize, Car, Reservation } = require('./models');
const { v4: uuidv4 } = require('uuid');

async function runSeed() {
  try {
    await sequelize.sync({ force: true });
    const cars = [
      { id: 'car1', name: 'Clio 5', price: 35, image: 'images/clio5.jpg' },
      { id: 'car2', name: 'Audi A4', price: 85, image: 'images/audia4.jpg' },
      { id: 'car3', name: 'Mercedes CLA 220', price: 120, image: 'images/Mercedes CLA 220.jpg' },
      { id: 'car4', name: 'Dacia Logan', price: 45, image: 'images/Dacia Logan.jpg' },
      { id: 'car5', name: 'Peugeot 308', price: 65, image: 'images/Peugeot 308.jpg' }
    ];
    await Car.bulkCreate(cars);

    const reservations = [
      { id: uuidv4(), carId: 'car1', startDate: '2025-11-10', endDate: '2025-11-12', customerName: 'Ahmed', customerEmail: 'ahmed@example.com', customerPhone: '+212600000001', totalPrice: 35 * 2 },
      { id: uuidv4(), carId: 'car2', startDate: '2025-11-13', endDate: '2025-11-16', customerName: 'Sara', customerEmail: 'sara@example.com', customerPhone: '+212600000002', totalPrice: 85 * 3 }
    ];
    await Reservation.bulkCreate(reservations);

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

runSeed();
