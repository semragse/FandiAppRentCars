const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fandicars.db',
  logging: false
});

async function checkAllReservations() {
  try {
    const reservations = await sequelize.query(
      'SELECT id, customerName, carId, startDate, endDate, status FROM reservations ORDER BY carId, startDate',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log('\n📊 ALL RESERVATIONS IN DATABASE:\n');
    console.log('Total:', reservations.length);
    console.log('\n');
    
    reservations.forEach((r, i) => {
      console.log(`${i+1}. ${r.customerName} | Car: ${r.carId} | ${r.startDate} → ${r.endDate} | Status: ${r.status}`);
    });

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkAllReservations();
