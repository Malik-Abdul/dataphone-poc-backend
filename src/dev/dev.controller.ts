import { Controller, Delete, Query, Get } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { DataSource } from 'typeorm';

import { seedPermissions } from '../database/seed/permission.seed';
import { seedRoles } from '../database/seed/role.seed';
import { seedUsers } from '../database/seed/user.seed';

@Controller('dev')
export class DevController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
  ) {}

  @Delete('database')
  async clearDatabase(@Query('reset') reset?: string) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Operation not allowed in production');
    }

    const entities = this.dataSource.entityMetadatas;

    for (const entity of entities) {
      await this.dataSource.query(
        `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`,
      );
    }

    if (reset === 'true') {
      await seedPermissions(this.dataSource);
      await seedRoles(this.dataSource);
      await seedUsers(this.dataSource);

      return {
        message: 'Database reset and reseeded successfully',
      };
    }

    return {
      message: 'Database truncated successfully',
    };
  }
  @Get('redis-test')
  async redisTest() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const redis = this.redisService.getClient();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    // await redis.set('name', 'Abdul');

    return {
      connected: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      value: await redis.ping(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      // ttl: await redis.ttl('name'),
    };
  }
}
