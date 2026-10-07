// src/database/seed/seed.ts

import AppDataSource from '../data-source';
import { seedPermissions } from './permission.seed';
import { seedRoles } from './role.seed';
import { seedUsers } from './user.seed';
import { seedCarriers } from './carrier.seed';

async function runSeeds() {
  try {
    await AppDataSource.initialize();

    await seedPermissions(AppDataSource);
    await seedRoles(AppDataSource);
    await seedUsers(AppDataSource);
    await seedCarriers(AppDataSource);

    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

runSeeds();
