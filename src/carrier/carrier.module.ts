import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Carrier } from './entities/carrier.entity';

import { CarrierService } from './carrier.service';
import { CarrierController } from './carrier.controller';

import { PeerlessAdapter } from './adapters/peerless.adapter';
import { BulkvsAdapter } from './adapters/bulkvs.adapter';
import { BandwidthAdapter } from './adapters/bandwidth.adapter';

import { PhoneNumbersModule } from '../phone-numbers/phone-numbers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Carrier]), PhoneNumbersModule],
  providers: [CarrierService, PeerlessAdapter, BulkvsAdapter, BandwidthAdapter],
  controllers: [CarrierController],
  exports: [CarrierService, PeerlessAdapter, BulkvsAdapter, BandwidthAdapter],
})
export class CarrierModule {}
