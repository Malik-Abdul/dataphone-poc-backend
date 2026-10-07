import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PortRequest } from './entities/port-request.entity';

import { PortRequestsService } from './port-requests.service';
import { PortRequestsController } from './port-requests.controller';

import { HistoryModule } from '../history/history.module';

@Module({
  imports: [TypeOrmModule.forFeature([PortRequest]), HistoryModule],
  providers: [PortRequestsService],
  controllers: [PortRequestsController],
  exports: [PortRequestsService],
})
export class PortRequestsModule {}

// The Port-In module allows staff to check number portability and create/manage port requests for customers.
// A request can move through Draft → Submitted → Date Confirmed → Completed, with support for Rejection, Resubmission, and Cancellation.
// When a port is completed, the number is automatically added to the inventory and assigned to the customer, with an immutable PORTED_IN history record.
