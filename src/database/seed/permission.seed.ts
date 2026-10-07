// src/database/seeds/permission.seed.ts

import { DataSource } from 'typeorm';

import { Permission } from '../../permissions/entities/permission.entity';

export async function seedPermissions(dataSource: DataSource): Promise<void> {
  const permissionRepository = dataSource.getRepository(Permission);

  const permissions = [
    // ----------------------------
    // Users
    // ----------------------------

    'user:create',
    'user:read',
    'user:update',
    'user:delete',
    'user:suspend',
    'user:activate',

    // ----------------------------
    // Roles
    // ----------------------------

    'role:create',
    'role:read',
    'role:update',
    'role:delete',

    // ----------------------------
    // Permissions
    // ----------------------------

    'permission:read',

    // ----------------------------
    // Customers
    // ----------------------------

    'customer:create',
    'customer:read',
    'customer:update',
    'customer:delete',

    // ----------------------------
    // Phone Numbers
    // ----------------------------

    'number:read',
    'number:search',
    'number:purchase',
    'number:assign',
    'number:release',
    'number:move',
    'number:disconnect',

    // ----------------------------
    // Carriers
    // ----------------------------

    'carrier:read',
    'carrier:sync',

    // ----------------------------
    // Porting
    // ----------------------------

    'port:read',
    'port:create',
    'port:update',
    'port:cancel',

    // ----------------------------
    // History / Audit
    // ----------------------------

    'history:read',

    // ----------------------------
    // Dashboard / Reports
    // ----------------------------

    'dashboard:read',
    'report:read',
  ];

  // Get existing permissions
  const existingPermissions = await permissionRepository.find({
    select: ['name'],
  });

  const existingNames = new Set(
    existingPermissions.map((permission) => permission.name),
  );

  // Filter only new permissions
  const permissionsToInsert = permissions
    .filter((name) => !existingNames.has(name))
    .map((name) => ({ name }));

  if (permissionsToInsert.length > 0) {
    await permissionRepository.insert(permissionsToInsert);
  }

  console.log(
    `✅ ${permissionsToInsert.length} permissions seeded successfully`,
  );
}
