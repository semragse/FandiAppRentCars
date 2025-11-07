const API_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing Backend API Endpoints...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing GET /health');
    const healthResponse = await fetch(`${API_URL}/health`);
    const health = await healthResponse.json();
    console.log('   ✅ Response:', health);
    console.log('');

    // Test 2: GET /cars
    console.log('2️⃣ Testing GET /cars');
    const carsResponse = await fetch(`${API_URL}/cars`);
    const cars = await carsResponse.json();
    console.log(`   ✅ Found ${cars.length} cars`);
    cars.forEach(car => {
      console.log(`      - ${car.name} (${car.price} DH/jour) @ ${car.locationAgency}`);
    });
    console.log('');

    // Test 3: GET /reservations
    console.log('3️⃣ Testing GET /reservations');
    const reservationsResponse = await fetch(`${API_URL}/reservations`);
    const reservations = await reservationsResponse.json();
    console.log(`   ✅ Found ${reservations.length} reservations`);
    reservations.forEach(res => {
      console.log(`      - ${res.customerName}: ${res.startDate} → ${res.endDate} (${res.totalPrice} DH)`);
    });
    console.log('');

    // Test 4: GET /reservations?carId=xxx
    if (cars.length > 0) {
      console.log(`4️⃣ Testing GET /reservations?carId=${cars[0].id}`);
      const carReservationsResponse = await fetch(`${API_URL}/reservations?carId=${cars[0].id}`);
      const carReservations = await carReservationsResponse.json();
      console.log(`   ✅ Found ${carReservations.length} reservations for ${cars[0].name}`);
      console.log('');
    }

    // Test 5: POST /cars (add new car)
    console.log('5️⃣ Testing POST /cars');
    const newCar = {
      name: 'Test Car - Hyundai i20',
      price: 220,
      image: 'images/test.jpg',
      locationAgency: 'Centre Ville'
    };
    const addCarResponse = await fetch(`${API_URL}/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCar)
    });
    const addedCar = await addCarResponse.json();
    console.log(`   ✅ Car added: ${addedCar.name} (ID: ${addedCar.id})`);
    console.log('');

    // Test 6: PUT /cars/:id (update car)
    console.log('6️⃣ Testing PUT /cars/:id');
    const updateData = { name: 'Test Car - Hyundai i20 Updated', price: 230 };
    const updateCarResponse = await fetch(`${API_URL}/cars/${addedCar.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const updatedCar = await updateCarResponse.json();
    console.log(`   ✅ Car updated: ${updatedCar.name} (Price: ${updatedCar.price} DH)`);
    console.log('');

    // Test 7: POST /reservations (add reservation)
    console.log('7️⃣ Testing POST /reservations');
    const newReservation = {
      carId: cars[0].id,
      startDate: '2025-12-01',
      endDate: '2025-12-05',
      departureAgency: 'Aéroport',
      returnAgency: 'Gare',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '0612345678',
      totalPrice: 1000,
      notes: 'Test reservation'
    };
    const addResResponse = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReservation)
    });
    const addedReservation = await addResResponse.json();
    console.log(`   ✅ Reservation added: ${addedReservation.customerName} (ID: ${addedReservation.id})`);
    console.log('');

    // Test 8: PUT /reservations/:id (update reservation)
    console.log('8️⃣ Testing PUT /reservations/:id');
    const updateResData = { customerName: 'Test Customer Updated', totalPrice: 1100 };
    const updateResResponse = await fetch(`${API_URL}/reservations/${addedReservation.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateResData)
    });
    const updatedReservation = await updateResResponse.json();
    console.log(`   ✅ Reservation updated: ${updatedReservation.customerName} (Price: ${updatedReservation.totalPrice} DH)`);
    console.log('');

    // Test 9: DELETE /reservations/:id
    console.log('9️⃣ Testing DELETE /reservations/:id');
    const deleteResResponse = await fetch(`${API_URL}/reservations/${addedReservation.id}`, {
      method: 'DELETE'
    });
    const deleteResResult = await deleteResResponse.json();
    console.log(`   ✅ Reservation deleted:`, deleteResResult);
    console.log('');

    // Test 10: DELETE /cars/:id
    console.log('🔟 Testing DELETE /cars/:id');
    const deleteCarResponse = await fetch(`${API_URL}/cars/${addedCar.id}`, {
      method: 'DELETE'
    });
    const deleteCarResult = await deleteCarResponse.json();
    console.log(`   ✅ Car deleted:`, deleteCarResult);
    console.log('');

    console.log('✅ All API tests completed successfully!');
    console.log('');
    console.log('📋 API Endpoints Summary:');
    console.log('   ✅ GET /health - Health check');
    console.log('   ✅ GET /cars - Get all cars');
    console.log('   ✅ POST /cars - Add a car');
    console.log('   ✅ PUT /cars/:id - Update a car');
    console.log('   ✅ DELETE /cars/:id - Delete a car');
    console.log('   ✅ GET /reservations - Get all reservations (optional ?carId filter)');
    console.log('   ✅ POST /reservations - Add a reservation');
    console.log('   ✅ PUT /reservations/:id - Update a reservation');
    console.log('   ✅ DELETE /reservations/:id - Delete a reservation');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Wait a bit for server to be ready, then run tests
setTimeout(() => {
  testAPI();
}, 1000);
