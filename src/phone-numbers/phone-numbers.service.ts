import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PhoneNumber, PhoneNumberStatus } from './entities/phone-number.entity';

import { Customer } from '../customers/entities/customer.entity';
import { HistoryAction } from '../history/entities/history.entity';
import { HistoryService } from '../history/history.service';

@Injectable()
export class PhoneNumbersService {
  constructor(
    @InjectRepository(PhoneNumber)
    private readonly phoneNumberRepository: Repository<PhoneNumber>,
    private readonly historyService: HistoryService,
  ) {}

  async findAll(filters?: {
    search?: string;
    customerId?: string;
    customer?: string;
    carrierId?: string;
    status?: PhoneNumberStatus;
    unassigned?: boolean;
  }) {
    const query = this.phoneNumberRepository
      .createQueryBuilder('phoneNumber')
      .leftJoinAndSelect('phoneNumber.carrier', 'carrier')
      .leftJoinAndSelect('phoneNumber.customer', 'customer');

    // Search phone number
    if (filters?.search) {
      query.andWhere('phoneNumber.phone_number ILIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    // Filter by customer ID
    if (filters?.customerId) {
      query.andWhere('phoneNumber.customer_id = :customerId', {
        customerId: filters.customerId,
      });
    }

    // Search customer name
    if (filters?.customer) {
      query.andWhere('customer.name ILIKE :customer', {
        customer: `%${filters.customer}%`,
      });
    }

    // Filter by carrier
    if (filters?.carrierId) {
      query.andWhere('phoneNumber.carrier_id = :carrierId', {
        carrierId: filters.carrierId,
      });
    }

    // Filter by status
    if (filters?.status) {
      query.andWhere('phoneNumber.status = :status', {
        status: filters.status,
      });
    }

    // Unassigned filter
    if (filters?.unassigned === true) {
      query.andWhere('phoneNumber.customer_id IS NULL');
    }

    return query.orderBy('phoneNumber.created_at', 'DESC').getMany();

    // return this.phoneNumberRepository.find({
    //   relations: {
    //     carrier: true,
    //   },
    //   order: {
    //     createdAt: 'DESC',
    //   },
    // });
  }

  async assign(
    phoneNumberId: string,
    customerId: string,
    performedBy?: string,
  ) {
    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: {
        id: phoneNumberId,
      },
    });

    if (!phoneNumber) {
      throw new NotFoundException('Phone number not found');
    }

    if (phoneNumber.status === PhoneNumberStatus.DISCONNECTED) {
      throw new BadRequestException('Disconnected number cannot be assigned');
    }

    if (phoneNumber.customerId) {
      throw new BadRequestException('Phone number is already assigned');
    }

    const customer = await this.phoneNumberRepository.manager
      .getRepository(Customer)
      .findOne({
        where: {
          id: customerId,
        },
      });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    phoneNumber.customerId = customerId;
    phoneNumber.status = PhoneNumberStatus.ASSIGNED;

    await this.phoneNumberRepository.save(phoneNumber);

    await this.historyService.create({
      phoneNumberId: phoneNumber.id,
      phoneNumber: phoneNumber.phoneNumber,
      action: HistoryAction.ASSIGNED,
      toCustomerId: customerId,
      performedBy,
    });

    return phoneNumber;
  }

  async move(phoneNumberId: string, customerId: string, performedBy?: string) {
    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: {
        id: phoneNumberId,
      },
    });

    if (!phoneNumber) {
      throw new NotFoundException('Phone number not found');
    }

    if (!phoneNumber.customerId) {
      throw new BadRequestException('Phone number is not currently assigned');
    }

    if (phoneNumber.customerId === customerId) {
      throw new BadRequestException(
        'Phone number is already assigned to this customer',
      );
    }

    const customer = await this.phoneNumberRepository.manager
      .getRepository(Customer)
      .findOne({
        where: {
          id: customerId,
        },
      });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const oldCustomerId = phoneNumber.customerId;

    phoneNumber.customerId = customerId;
    phoneNumber.status = PhoneNumberStatus.ASSIGNED;

    await this.phoneNumberRepository.save(phoneNumber);

    await this.historyService.create({
      phoneNumberId: phoneNumber.id,
      phoneNumber: phoneNumber.phoneNumber,
      action: HistoryAction.MOVED,
      fromCustomerId: oldCustomerId,
      toCustomerId: customerId,
      performedBy,
    });

    return phoneNumber;
  }

  async release(phoneNumberId: string, performedBy?: string) {
    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: {
        id: phoneNumberId,
      },
    });

    if (!phoneNumber) {
      throw new NotFoundException('Phone number not found');
    }

    if (!phoneNumber.customerId) {
      throw new BadRequestException('Phone number is already unassigned');
    }

    const oldCustomerId = phoneNumber.customerId;

    phoneNumber.customerId = undefined;
    phoneNumber.status = PhoneNumberStatus.UNASSIGNED;

    await this.phoneNumberRepository.save(phoneNumber);

    await this.historyService.create({
      phoneNumberId: phoneNumber.id,
      phoneNumber: phoneNumber.phoneNumber,
      action: HistoryAction.RELEASED,
      fromCustomerId: oldCustomerId,
      performedBy,
    });

    return phoneNumber;
  }

  async upsertNumbers(
    carrierId: string,
    numbers: {
      phoneNumber: string;
      status: 'AVAILABLE' | 'ACTIVE' | 'DISCONNECTED';
      city?: string;
      state?: string;
      dateObtained?: Date;
    }[],
  ) {
    for (const number of numbers) {
      const existing = await this.phoneNumberRepository.findOne({
        where: {
          phoneNumber: number.phoneNumber,
        },
      });

      if (existing) {
        existing.carrierId = carrierId;
        existing.city = number.city;
        existing.state = number.state;
        existing.dateObtained = number.dateObtained;

        if (number.status === 'DISCONNECTED') {
          existing.status = PhoneNumberStatus.DISCONNECTED;
        }

        await this.phoneNumberRepository.save(existing);

        continue;
      }

      await this.phoneNumberRepository.save({
        phoneNumber: number.phoneNumber,
        carrierId,
        city: number.city,
        state: number.state,
        dateObtained: number.dateObtained,
        status:
          number.status === 'DISCONNECTED'
            ? PhoneNumberStatus.DISCONNECTED
            : PhoneNumberStatus.UNASSIGNED,
      });
    }

    return numbers.length;
  }
  // src/phone-numbers/phone-numbers.service.ts

  async findAvailableNumbers(filters?: {
    search?: string;
    carrierId?: string;
    city?: string;
    state?: string;
  }) {
    const query = this.phoneNumberRepository
      .createQueryBuilder('phoneNumber')
      .leftJoinAndSelect('phoneNumber.carrier', 'carrier');

    query.andWhere('phoneNumber.status = :status', {
      status: PhoneNumberStatus.UNASSIGNED,
    });

    if (filters?.search) {
      query.andWhere('phoneNumber.phone_number ILIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    if (filters?.carrierId) {
      query.andWhere('phoneNumber.carrier_id = :carrierId', {
        carrierId: filters.carrierId,
      });
    }

    if (filters?.city) {
      query.andWhere('phoneNumber.city ILIKE :city', {
        city: `%${filters.city}%`,
      });
    }

    if (filters?.state) {
      query.andWhere('phoneNumber.state ILIKE :state', {
        state: `%${filters.state}%`,
      });
    }

    return query.orderBy('phoneNumber.phone_number', 'ASC').getMany();
  }

  async purchase(
    phoneNumberId: string,
    customerId: string,
    performedBy?: string,
  ) {
    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: { id: phoneNumberId },
      relations: {
        carrier: true,
      },
    });

    if (!phoneNumber) {
      throw new NotFoundException(`Phone number not found: ${phoneNumberId}`);
    }

    if (phoneNumber.status !== PhoneNumberStatus.UNASSIGNED) {
      throw new BadRequestException(
        'Phone number is not available for purchase',
      );
    }

    const customerRepository =
      this.phoneNumberRepository.manager.getRepository(Customer);

    const customer = await customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer not found: ${customerId}`);
    }

    phoneNumber.status = PhoneNumberStatus.ASSIGNED;
    phoneNumber.customerId = customer.id;

    const savedNumber = await this.phoneNumberRepository.save(phoneNumber);

    await this.historyService.create({
      phoneNumberId: savedNumber.id,
      phoneNumber: savedNumber.phoneNumber,
      action: HistoryAction.BOUGHT,
      performedBy,
      metadata: {
        carrierId: savedNumber.carrierId,
        carrier: savedNumber.carrier?.name,
      },
    });

    await this.historyService.create({
      phoneNumberId: savedNumber.id,
      phoneNumber: savedNumber.phoneNumber,
      action: HistoryAction.ASSIGNED,
      toCustomerId: customer.id,
      performedBy,
    });

    return savedNumber;
  }
  async disconnect(phoneNumberId: string, performedBy?: string) {
    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: { id: phoneNumberId },
    });

    if (!phoneNumber) {
      throw new NotFoundException(`Phone number not found: ${phoneNumberId}`);
    }

    if (phoneNumber.status === PhoneNumberStatus.DISCONNECTED) {
      throw new BadRequestException('Phone number is already disconnected');
    }

    const previousCustomerId = phoneNumber.customerId;

    phoneNumber.status = PhoneNumberStatus.DISCONNECTED;

    phoneNumber.customerId = undefined;

    const savedNumber = await this.phoneNumberRepository.save(phoneNumber);

    await this.historyService.create({
      phoneNumberId: savedNumber.id,
      phoneNumber: savedNumber.phoneNumber,
      action: HistoryAction.DISCONNECTED,
      fromCustomerId: previousCustomerId,
      performedBy,
    });

    return savedNumber;
  }
}
