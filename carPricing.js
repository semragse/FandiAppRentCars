// carPricing.js
// Script de calcul de prix avec majoration weekend pour TOUTES les voitures
// Support des voitures dynamiques ajoutées via l'interface admin
// Réductions automatiques pour locations longue durée

/**
 * ================================================
 * FALLBACK: Tarifs de base par voiture
 * ================================================
 * Ces tarifs ne sont utilisés que si window.carsDatabase (index.html)
 * ou window.cars (admin.html) ne sont pas disponibles.
 * Les voitures sont normalement chargées dynamiquement depuis l'API backend.
 */
const CAR_RATES = {
  car1: { name: 'Clio 5', baseRate: 35 },
  car2: { name: 'Audi A4', baseRate: 85 },
  car3: { name: 'Mercedes CLA 220', baseRate: 120 },
  car4: { name: 'Dacia Logan', baseRate: 45 },
  car5: { name: 'Peugeot 308', baseRate: 65 }
};

const WEEKEND_SURCHARGE = 0.2; // 20%

/**
 * ================================================
 * CONFIGURATION DES RÉDUCTIONS LONGUE DURÉE
 * ================================================
 * Modifiez ces valeurs pour ajuster les seuils et pourcentages de réduction
 * Les réductions sont appliquées automatiquement selon la durée de location
 */
const DURATION_DISCOUNTS = [
  { minDays: 15, discount: 0.20, label: '20% (15+ jours)' },  // 20% pour 15 jours et plus
  { minDays: 8,  discount: 0.15, label: '15% (8-14 jours)' }, // 15% pour 8 à 14 jours
  { minDays: 4,  discount: 0.10, label: '10% (4-7 jours)' }   // 10% pour 4 à 7 jours
  // Les réductions sont triées par ordre décroissant pour appliquer la plus avantageuse
];

function isWeekend(date) {
  const d = new Date(date);
  return d.getDay() === 0 || d.getDay() === 6; // Sunday=0, Saturday=6
}

/**
 * Calcule la réduction applicable selon la durée de location
 * @param {number} days - Nombre de jours de location
 * @returns {object} { discount: 0.10, label: '10% (4-7 jours)' } ou null si pas de réduction
 */
function getDurationDiscount(days) {
  // Parcourir les réductions du plus grand seuil au plus petit
  for (const tier of DURATION_DISCOUNTS) {
    if (days >= tier.minDays) {
      return {
        discount: tier.discount,
        label: tier.label,
        minDays: tier.minDays
      };
    }
  }
  return null; // Pas de réduction pour les locations courtes
}

/**
 * Calcule le prix de location avec majoration weekend ET réduction longue durée
 * @param {string} carId - ID de la voiture (car1, car2, etc.)
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD (exclusive)
 * @param {boolean} applyDiscount - Si false, désactive la réduction automatique (pour prix manuel admin)
 * @returns {object} breakdown détaillé avec réductions
 */
function calculateCarPriceWithWeekend(carId, startDate, endDate, applyDiscount = true) {
  let carInfo = CAR_RATES[carId];
  
  // Si la voiture n'est pas dans CAR_RATES (nouvelle voiture ajoutée dynamiquement),
  // chercher dans window.cars (admin.html) ou window.carsDatabase (index.html)
  if (!carInfo && window.cars) {
    const car = window.cars.find(c => c.id === carId);
    if (car) {
      carInfo = { name: car.name, baseRate: car.price };
      console.log(`✅ Voiture dynamique trouvée (admin): ${car.name} (${carId}) - ${car.price}€/jour`);
    }
  }
  
  // Chercher dans carsDatabase (index.html)
  if (!carInfo && window.carsDatabase && window.carsDatabase[carId]) {
    const car = window.carsDatabase[carId];
    carInfo = { name: car.name, baseRate: car.price };
    console.log(`✅ Voiture dynamique trouvée (index): ${car.name} (${carId}) - ${car.price}€/jour`);
  }
  
  if (!carInfo) {
    console.error(`❌ Voiture inconnue: ${carId}. CAR_RATES:`, Object.keys(CAR_RATES), 'window.cars:', window.cars, 'window.carsDatabase:', window.carsDatabase);
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
  
  // Calcul du prix de base + majoration weekend
  let base = 0, weekendExtra = 0;
  for (const day of days) {
    base += BASE_RATE;
    if (isWeekend(day)) {
      weekendExtra += BASE_RATE * WEEKEND_SURCHARGE;
    }
  }
  
  // Prix avant réduction (base + weekend)
  const subtotal = Math.round(base + weekendExtra);
  
  // ================================================
  // CALCUL DE LA RÉDUCTION LONGUE DURÉE
  // ================================================
  let durationDiscount = null;
  let discountAmount = 0;
  let finalTotal = subtotal;
  
  if (applyDiscount) {
    durationDiscount = getDurationDiscount(days.length);
    
    if (durationDiscount) {
      // La réduction s'applique sur le prix total (base + weekend)
      discountAmount = Math.round(subtotal * durationDiscount.discount);
      finalTotal = subtotal - discountAmount;
      
      console.log(`🎉 Réduction longue durée appliquée: ${durationDiscount.label} = -${discountAmount}€`);
    }
  }
  
  return {
    car: carInfo.name,
    carId: carId,
    days: days.length,
    baseRate: BASE_RATE,
    baseTotal: base,
    weekendExtra: Math.round(weekendExtra),
    subtotal: subtotal, // Prix avant réduction
    
    // Informations sur la réduction
    hasDiscount: durationDiscount !== null,
    discountPercent: durationDiscount ? durationDiscount.discount : 0,
    discountLabel: durationDiscount ? durationDiscount.label : null,
    discountAmount: discountAmount,
    
    total: finalTotal, // Prix final après réduction
    
    breakdown: days.map(d => ({
      date: d.toISOString().slice(0,10),
      isWeekend: isWeekend(d),
      price: BASE_RATE + (isWeekend(d) ? BASE_RATE * WEEKEND_SURCHARGE : 0)
    }))
  };
}

// Garder la compatibilité avec l'ancien nom de fonction
function calculateClio5PriceForUI(startDate, endDate) {
  return calculateCarPriceWithWeekend('car1', startDate, endDate, true);
}

// Export global pour utilisation dans index.html et admin.html
window.calculateCarPriceWithWeekend = calculateCarPriceWithWeekend;
window.calculateClio5PriceForUI = calculateClio5PriceForUI;
window.getDurationDiscount = getDurationDiscount; // Export pour affichage UI

