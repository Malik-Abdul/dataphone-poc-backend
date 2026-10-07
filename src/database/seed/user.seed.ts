import { DataSource } from 'typeorm';
import bcrypt from 'bcrypt';

import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);

  const superAdminRole = await roleRepo.findOne({
    where: { name: 'Super Admin' },
  });

  const adminRole = await roleRepo.findOne({
    where: { name: 'Admin' },
  });

  const moderatorRole = await roleRepo.findOne({
    where: { name: 'Moderator' },
  });

  const creatorRole = await roleRepo.findOne({
    where: { name: 'Creator' },
  });

  const userRole = await roleRepo.findOne({
    where: { name: 'User' },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const hashedPassword: string = await bcrypt.hash('Password123!', 10);

  const users = [
    {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      roles: superAdminRole ? [superAdminRole] : [],
    },
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: hashedPassword,
      roles: adminRole ? [adminRole] : [],
    },
    {
      firstName: 'Moderator',
      lastName: 'User',
      email: 'moderator@example.com',
      password: hashedPassword,
      roles: moderatorRole ? [moderatorRole] : [],
    },
    {
      firstName: 'Creator',
      lastName: 'User',
      email: 'creator@example.com',
      password: hashedPassword,
      roles: creatorRole ? [creatorRole] : [],
    },
    {
      firstName: 'Normal',
      lastName: 'User',
      email: 'user@example.com',
      password: hashedPassword,
      roles: userRole ? [userRole] : [],
    },
  ];

  for (const userData of users) {
    const existingUser = await userRepo.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      await userRepo.save(userRepo.create(userData));
    }
  }

  console.log('✅ Users seeded');
}
