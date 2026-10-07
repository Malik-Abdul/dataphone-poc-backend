import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(data: { name: string; email?: string; phone?: string }) {
    const customer = this.customerRepository.create(data);

    return this.customerRepository.save(customer);
  }

  async findAll() {
    return this.customerRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({
      where: {
        id,
      },
      relations: {
        phoneNumbers: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer not found: ${id}`);
    }

    return customer;
  }
}
