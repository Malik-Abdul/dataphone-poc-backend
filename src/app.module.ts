import { join } from 'path';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';

import { DevModule } from './dev/dev.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { AppThrottlerModule } from './throttler/throttler.module';

import { AppConfigModule } from './common/config/app-config.module';
import { CarrierModule } from './carrier/carrier.module';
import { PhoneNumbersModule } from './phone-numbers/phone-numbers.module';
import { CustomersModule } from './customers/customers.module';
import { HistoryModule } from './history/history.module';
import { PortRequestsModule } from './port-requests/port-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    RolesModule,
    PermissionsModule,
    DevModule,
    RedisModule,
    AuthModule,
    AppThrottlerModule,
    AppConfigModule,
    CarrierModule,
    PhoneNumbersModule,
    CustomersModule,
    HistoryModule,
    PortRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
