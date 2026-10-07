import type { Response } from 'express';

import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { PhoneNumbersService } from './phone-numbers.service';

import { PhoneNumberStatus } from './entities/phone-number.entity';

@Controller('phone-numbers')
export class PhoneNumbersController {
  constructor(private readonly phoneNumbersService: PhoneNumbersService) {}

  // --------------------------------------------------
  // Inventory
  // --------------------------------------------------

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('customerId') customerId?: string,
    @Query('customer') customer?: string,
    @Query('carrierId') carrierId?: string,
    @Query('status') status?: PhoneNumberStatus,
    @Query('unassigned') unassigned?: string,
  ) {
    return this.phoneNumbersService.findAll({
      search,
      customerId,
      customer,
      carrierId,
      status,
      unassigned: unassigned === 'true',
    });
  }

  // --------------------------------------------------
  // CSV Export
  // --------------------------------------------------

  @Get('export')
  async exportCsv(
    @Query('search') search: string | undefined,
    @Query('customerId') customerId: string | undefined,
    @Query('customer') customer: string | undefined,
    @Query('carrierId') carrierId: string | undefined,
    @Query('status') status: PhoneNumberStatus | undefined,
    @Query('unassigned') unassigned: string | undefined,
    @Res() response: Response,
  ) {
    const csv = await this.phoneNumbersService.exportCsv({
      search,
      customerId,
      customer,
      carrierId,
      status,
      unassigned: unassigned === 'true',
    });

    response.setHeader('Content-Type', 'text/csv');

    response.setHeader(
      'Content-Disposition',
      'attachment; filename="phone-numbers.csv"',
    );

    response.send(csv);
  }

  // --------------------------------------------------
  // Available Numbers
  // --------------------------------------------------

  @Get('available')
  async findAvailable(
    @Query('search') search?: string,
    @Query('carrierId') carrierId?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
  ) {
    return this.phoneNumbersService.findAvailableNumbers({
      search,
      carrierId,
      city,
      state,
    });
  }

  // --------------------------------------------------
  // Purchase
  // --------------------------------------------------

  @Post('purchase')
  async purchase(
    @Body()
    body: {
      phoneNumberId: string;
      customerId: string;
    },
  ) {
    return this.phoneNumbersService.purchase(
      body.phoneNumberId,
      body.customerId,
    );
  }
  // --------------------------------------------------
  // Assign
  // --------------------------------------------------

  @Post(':id/assign')
  async assign(@Param('id') id: string, @Body() body: { customerId: string }) {
    return this.phoneNumbersService.assign(id, body.customerId);
  }

  // --------------------------------------------------
  // Move
  // --------------------------------------------------

  @Post(':id/move')
  async move(@Param('id') id: string, @Body() body: { customerId: string }) {
    return this.phoneNumbersService.move(id, body.customerId);
  }

  // --------------------------------------------------
  // Release
  // --------------------------------------------------

  @Post(':id/release')
  async release(@Param('id') id: string) {
    return this.phoneNumbersService.release(id);
  }
  // --------------------------------------------------
  // Disconnect
  // --------------------------------------------------

  @Post(':id/disconnect')
  async disconnect(@Param('id') id: string) {
    return this.phoneNumbersService.disconnect(id);
  }

  // do NOT call purchase and then disconnect to make a number unavailable.
  // The purchase endpoint makes the number owned/assigned to a customer.
  // The disconnect endpoint means the number's service is terminated.
}
