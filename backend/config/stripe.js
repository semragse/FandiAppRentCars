require('dotenv').config();

// Stripe configuration - only initialize if key is provided
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_dev';

let stripe;
try {
  stripe = require('stripe')(stripeSecretKey);
  console.log('✅ Stripe initialized successfully');
} catch (error) {
  console.warn('⚠️ Stripe initialization failed:', error.message);
  // Create a dummy stripe object to prevent crashes
  stripe = {
    paymentIntents: {
      create: async () => { throw new Error('Stripe not configured'); }
    }
  };
}

module.exports = stripe;