import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { PortRequestsService } from './port-requests.service';

import { PortRequestStatus } from './entities/port-request.entity';

@Controller('port-requests')
export class PortRequestsController {
  constructor(private readonly portRequestsService: PortRequestsService) {}
  // --------------------------------------------------
  // Check portability
  // --------------------------------------------------

  @Post('check-portability')
  async checkPortability(
    @Body()
    body: {
      phoneNumber: string;
    },
  ) {
    return this.portRequestsService.checkPortability(body.phoneNumber);
  }

  // --------------------------------------------------
  // Create
  // --------------------------------------------------

  @Post()
  async create(
    @Body()
    body: {
      customerId: string;
      carrierId: string;
      phoneNumbers: string[];
      accountName: string;
      serviceAddress: string;
      currentProvider: string;
      accountNumber?: string;
      pin?: string;
    },
  ) {
    return this.portRequestsService.create(body);
  }

  // --------------------------------------------------
  // List
  // --------------------------------------------------

  @Get()
  async findAll(
    @Query('status')
    status?: PortRequestStatus,
  ) {
    return this.portRequestsService.findAll(status);
  }

  // --------------------------------------------------
  // Details
  // --------------------------------------------------

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.portRequestsService.findOne(id);
  }

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  @Post(':id/submit')
  async submit(@Param('id') id: string) {
    return this.portRequestsService.submit(id);
  }

  // --------------------------------------------------
  // Confirm FOC / Port Date
  // --------------------------------------------------

  @Post(':id/confirm-date')
  async confirmDate(
    @Param('id') id: string,
    @Body()
    body: {
      confirmedPortDate: string;
    },
  ) {
    return this.portRequestsService.confirmDate(id, body.confirmedPortDate);
  }

  // --------------------------------------------------
  // Reject
  // --------------------------------------------------

  @Post(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body()
    body: {
      rejectionReason: string;
    },
  ) {
    return this.portRequestsService.reject(id, body.rejectionReason);
  }

  // --------------------------------------------------
  // Resubmit
  // --------------------------------------------------

  @Post(':id/resubmit')
  async resubmit(@Param('id') id: string) {
    return this.portRequestsService.submit(id);
  }

  // --------------------------------------------------
  // Cancel
  // --------------------------------------------------

  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.portRequestsService.cancel(id);
  }

  // --------------------------------------------------
  // Complete
  // --------------------------------------------------

  @Post(':id/complete')
  async complete(@Param('id') id: string) {
    return this.portRequestsService.complete(id);
  }
}
