import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { THROTTLE_VALUES } from 'src/common/constants/throttle.constants';

@Module({
  imports: [
    RedisModule,
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redisService: RedisService) => ({
        throttlers: [
          { name: 'public', ...THROTTLE_VALUES.DEFAULT },
          { name: 'auth', ...THROTTLE_VALUES.AUTH },
        ],
        storage: new ThrottlerStorageRedisService(redisService.getClient()),
      }),
    }),
  ],
  exports: [ThrottlerModule],
})
export class AppThrottlerModule {}
