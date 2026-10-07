import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PhoneNumbersService } from './phone-numbers.service';

import { PhoneNumberStatus } from './entities/phone-number.entity';

@Controller('phone-numbers')
export class PhoneNumbersController {
  constructor(private readonly phoneNumbersService: PhoneNumbersService) {}

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

  @Post(':id/assign')
  async assign(@Param('id') id: string, @Body() body: { customerId: string }) {
    return this.phoneNumbersService.assign(id, body.customerId);
  }

  @Post(':id/move')
  async move(@Param('id') id: string, @Body() body: { customerId: string }) {
    return this.phoneNumbersService.move(id, body.customerId);
  }

  @Post(':id/release')
  async release(@Param('id') id: string) {
    return this.phoneNumbersService.release(id);
  }

  @Post(':id/disconnect')
  async disconnect(@Param('id') id: string) {
    return this.phoneNumbersService.disconnect(id);
  }
  // do NOT call purchase and then disconnect to make a number unavailable.
  // The purchase endpoint makes the number owned/assigned to a customer.
  // The disconnect endpoint means the number's service is terminated.
}
