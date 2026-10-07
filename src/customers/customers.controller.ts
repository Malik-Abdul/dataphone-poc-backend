import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      email?: string;
      phone?: string;
    },
  ) {
    return this.customersService.create(body);
  }

  @Get()
  async findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }
}
