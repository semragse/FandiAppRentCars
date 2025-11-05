// Pricing logic for Clio 5 only
// Base rate: 35€/day
// Weekend (Sat/Sun): +20% per day

const BASE_RATE = 35;
const WEEKEND_SURCHARGE = 0.2;

function isWeekend(date) {
  const d = new Date(date);
  return d.getDay() === 0 || d.getDay() === 6; // Sunday=0, Saturday=6
}

/**
 * Calculates rental price for Clio 5 with weekend surcharge
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD (exclusive)
 * @returns {object} breakdown
 */
function calculateClio5Price(startDate, endDate) {
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
    car: 'Clio 5',
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

// Example usage
if (require.main === module) {
  // Test: samedi-dimanche (2025-11-08 à 2025-11-10)
  const result = calculateClio5Price('2025-11-08', '2025-11-10');
  console.log(JSON.stringify(result, null, 2));
}

module.exports = { calculateClio5Price };
