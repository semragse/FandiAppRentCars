#!/usr/bin/env node
/**
 * Database migrate (sync) script for production environments.
 * - Authenticates
 * - Syncs models (non-destructive)
 * - Optional seed when SEED_ON_START=true
 */
require('dotenv').config();
const path = require('path');
const { sequelize, Car } = require('../backend/models');

(async () => {
  try {
    console.log('🔄 [migrate] Starting migration...');
    const summaryBefore = sequelize.connectionSummary ? sequelize.connectionSummary() : { dialect: sequelize.getDialect() };
    console.log('📋 [migrate] Connection summary:', summaryBefore);

    await sequelize.authenticate();
    console.log('✅ [migrate] Authenticated');

    await sequelize.sync({ alter: false });
    console.log('✅ [migrate] Sync complete (alter: false)');

    if (process.env.SEED_ON_START === 'true') {
      console.log('🌱 [migrate] Seeding enabled (SEED_ON_START=true)');
      await require('../backend/seed');
    } else {
      const carCount = await Car.count();
      console.log(`🚗 [migrate] Car count existing: ${carCount}`);
    }

    console.log('🎉 [migrate] Migration finished');
    process.exit(0);
  } catch (err) {
    console.error('❌ [migrate] Migration failed:', err);
    process.exit(1);
  }
})();
