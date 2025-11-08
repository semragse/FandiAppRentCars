const { Reservation } = require('../backend/models');

async function viewReservations() {
  try {
    const reservations = await Reservation.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    console.log('\n📋 RESERVATIONS IN DATABASE:\n');
    console.log('═'.repeat(80));
    
    reservations.forEach(res => {
      console.log(`\n🎫 Reservation ${res.id.substring(0, 8)}...`);
      console.log(`   🚗 Car: ${res.carId}`);
      console.log(`   👤 Client: ${res.customerName} (${res.customerEmail})`);
      console.log(`   📅 Period: ${res.startDate} → ${res.endDate}`);
      console.log(`   💰 Total: ${res.totalPrice}€`);
      console.log(`   📊 Status: ${res.status || 'pending'}`);
      console.log(`   💳 Payment Method: ${res.paymentMethod || 'N/A'}`);
      console.log(`   ✅ Payment Status: ${res.paymentStatus || 'N/A'}`);
      if (res.stripePaymentIntentId) {
        console.log(`   🆔 Stripe ID: ${res.stripePaymentIntentId}`);
      }
      if (res.paypalTransactionId) {
        console.log(`   🆔 PayPal ID: ${res.paypalTransactionId}`);
      }
      if (res.paymentNotes) {
        console.log(`   📝 Notes: ${res.paymentNotes}`);
      }
    });
    
    console.log('\n' + '═'.repeat(80));
    console.log(`\n✅ Total: ${reservations.length} reservations\n`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

viewReservations();
