import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PhoneNumbersService } from './phone-numbers.service';
import { PhoneNumbersController } from './phone-numbers.controller';

import { PhoneNumber } from './entities/phone-number.entity';

import { HistoryModule } from '../history/history.module';

@Module({
  imports: [TypeOrmModule.forFeature([PhoneNumber]), HistoryModule],
  providers: [PhoneNumbersService],
  controllers: [PhoneNumbersController],
  exports: [PhoneNumbersService],
})
export class PhoneNumbersModule {}
