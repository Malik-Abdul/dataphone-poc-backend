import { DataSource } from 'typeorm';

import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';

export async function seedRoles(dataSource: DataSource): Promise<void> {
  const roleRepo = dataSource.getRepository(Role);
  const permissionRepo = dataSource.getRepository(Permission);

  const allPermissions = await permissionRepo.find();

  const getPermissions = (names: string[]) =>
    allPermissions.filter((permission) => names.includes(permission.name));

  const roles = [
    {
      name: 'Admin',
      permissions: allPermissions,
    },

    {
      name: 'Manager',
      permissions: getPermissions([
        // Users
        'user:read',

        // Customers
        'customer:read',
        'customer:create',
        'customer:update',
        'customer:delete',

        // Numbers
        'number:read',
        'number:search',
        'number:purchase',
        'number:assign',
        'number:release',
        'number:move',
        'number:disconnect',

        // Carriers
        'carrier:read',
        'carrier:sync',

        // Porting
        'port:read',
        'port:create',
        'port:update',
        'port:cancel',

        // History / Reports
        'history:read',
        'dashboard:read',
        'report:read',
      ]),
    },

    {
      name: 'Staff',
      permissions: getPermissions([
        // Customers
        'customer:read',

        // Numbers
        'number:read',
        'number:search',
        'number:purchase',
        'number:assign',
        'number:release',
        'number:move',
        'number:disconnect',

        // Carriers
        'carrier:read',

        // Porting
        'port:read',
        'port:create',
        'port:update',

        // History
        'history:read',

        // Dashboard
        'dashboard:read',
      ]),
    },

    {
      name: 'Viewer',
      permissions: getPermissions([
        // Customers
        'customer:read',

        // Numbers
        'number:read',

        // Carriers
        'carrier:read',

        // Porting
        'port:read',

        // History / Reports
        'history:read',
        'dashboard:read',
        'report:read',
      ]),
    },
  ];

  for (const role of roles) {
    const existingRole = await roleRepo.findOne({
      where: { name: role.name },
    });

    if (!existingRole) {
      await roleRepo.save(roleRepo.create(role));

      console.log(`✅ Created role: ${role.name}`);
    }
  }

  console.log('✅ Roles seeded successfully');
}
