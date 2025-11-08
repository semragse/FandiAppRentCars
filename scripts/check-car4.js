const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fandicars.db',
  logging: false
});

async function checkCar4() {
  try {
    const cars = await sequelize.query(
      'SELECT * FROM cars WHERE id = "car4"',
      { type: Sequelize.QueryTypes.SELECT }
    );
    console.log('Car4 details:', JSON.stringify(cars, null, 2));

    const reservations = await sequelize.query(
      'SELECT * FROM reservations WHERE carId = "car4"',
      { type: Sequelize.QueryTypes.SELECT }
    );
    console.log('\nCar4 reservations:', JSON.stringify(reservations, null, 2));

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCar4();
