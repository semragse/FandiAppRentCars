// Script pour calcul de prix avec majoration weekend pour TOUTES les voitures
// Tarifs de base par voiture + majoration weekend 20%

const CAR_RATES = {
  car1: { name: 'Clio 5', baseRate: 35 },
  car2: { name: 'Audi A4', baseRate: 85 },
  car3: { name: 'Mercedes CLA 220', baseRate: 120 },
  car4: { name: 'Dacia Logan', baseRate: 45 },
  car5: { name: 'Peugeot 308', baseRate: 65 }
};

const WEEKEND_SURCHARGE = 0.2; // 20%

function isWeekend(date) {
  const d = new Date(date);
  return d.getDay() === 0 || d.getDay() === 6; // Sunday=0, Saturday=6
}

/**
 * Calcule le prix de location avec majoration weekend pour n'importe quelle voiture
 * @param {string} carId - ID de la voiture (car1, car2, etc.)
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD (exclusive)
 * @returns {object} breakdown
 */
function calculateCarPriceWithWeekend(carId, startDate, endDate) {
  let carInfo = CAR_RATES[carId];
  
  // Si la voiture n'est pas dans CAR_RATES (nouvelle voiture ajoutée dynamiquement),
  // chercher dans window.cars si disponible (admin.html)
  if (!carInfo && window.cars) {
    const car = window.cars.find(c => c.id === carId);
    if (car) {
      carInfo = { name: car.name, baseRate: car.price };
      console.log(`✅ Voiture dynamique trouvée: ${car.name} (${carId}) - ${car.price}€/jour`);
    }
  }
  
  if (!carInfo) {
    console.error(`❌ Voiture inconnue: ${carId}. CAR_RATES:`, Object.keys(CAR_RATES), 'window.cars:', window.cars);
    throw new Error(`Voiture inconnue: ${carId}`);
  }
  
  const BASE_RATE = carInfo.baseRate;
  
  const days = [];
  let current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current < end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  let base = 0, weekendExtra = 0;
  for (const day of days) {
    base += BASE_RATE;
    if (isWeekend(day)) {
      weekendExtra += BASE_RATE * WEEKEND_SURCHARGE;
    }
  }
  
  return {
    car: carInfo.name,
    carId: carId,
    days: days.length,
    baseRate: BASE_RATE,
    baseTotal: base,
    weekendExtra: Math.round(weekendExtra),
    total: Math.round(base + weekendExtra),
    breakdown: days.map(d => ({
      date: d.toISOString().slice(0,10),
      isWeekend: isWeekend(d),
      price: BASE_RATE + (isWeekend(d) ? BASE_RATE * WEEKEND_SURCHARGE : 0)
    }))
  };
}

// Garder la compatibilité avec l'ancien nom (pour Clio 5)
function calculateClio5PriceForUI(startDate, endDate) {
  return calculateCarPriceWithWeekend('car1', startDate, endDate);
}

// Export pour utilisation dans index.html
window.calculateCarPriceWithWeekend = calculateCarPriceWithWeekend;
window.calculateClio5PriceForUI = calculateClio5PriceForUI;

