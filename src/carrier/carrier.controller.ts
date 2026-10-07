import { Controller, Get, Param, Post } from '@nestjs/common';
import { CarrierService } from './carrier.service';

@Controller('carrier')
export class CarrierController {
  constructor(private readonly carrierService: CarrierService) {}

  @Get(':carrier/numbers')
  async getNumbers(@Param('carrier') carrier: string) {
    return this.carrierService.getNumbers(carrier);
  }

  @Post(':carrier/sync')
  async syncNumbers(@Param('carrier') carrier: string) {
    return this.carrierService.syncNumbers(carrier);
  }
}
