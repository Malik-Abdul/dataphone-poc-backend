/* eslint-disable @typescript-eslint/require-await */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PortRequest, PortRequestStatus } from './entities/port-request.entity';

import {
  PhoneNumber,
  PhoneNumberStatus,
} from '../phone-numbers/entities/phone-number.entity';

import { HistoryAction } from '../history/entities/history.entity';

import { HistoryService } from '../history/history.service';

import { Customer } from '../customers/entities/customer.entity';

import { Carrier } from '../carrier/entities/carrier.entity';

@Injectable()
export class PortRequestsService {
  constructor(
    @InjectRepository(PortRequest)
    private readonly portRequestRepository: Repository<PortRequest>,

    private readonly historyService: HistoryService,
  ) {}

  // --------------------------------------------------
  // Portability Check
  // --------------------------------------------------

  async checkPortability(phoneNumber: string) {
    // Mock carrier response.
    // In the real implementation this would call
    // the selected carrier API.

    const normalizedNumber = phoneNumber.trim();

    if (!normalizedNumber) {
      throw new BadRequestException('Phone number is required');
    }

    return {
      phoneNumber: normalizedNumber,
      portable: true,
      message: 'Number is portable',
    };
  }
  // --------------------------------------------------
  // Create Port Request
  // --------------------------------------------------

  async create(data: {
    customerId: string;
    carrierId: string;
    phoneNumbers: string[];
    accountName: string;
    serviceAddress: string;
    currentProvider: string;
    accountNumber?: string;
    pin?: string;
  }) {
    if (!data.phoneNumbers || data.phoneNumbers.length === 0) {
      throw new BadRequestException('At least one phone number is required');
    }

    const customerRepository =
      this.portRequestRepository.manager.getRepository(Customer);

    const carrierRepository =
      this.portRequestRepository.manager.getRepository(Carrier);

    const customer = await customerRepository.findOne({
      where: {
        id: data.customerId,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer not found: ${data.customerId}`);
    }

    const carrier = await carrierRepository.findOne({
      where: {
        id: data.carrierId,
      },
    });

    if (!carrier) {
      throw new NotFoundException(`Carrier not found: ${data.carrierId}`);
    }

    const portRequest = this.portRequestRepository.create({
      customerId: data.customerId,
      carrierId: data.carrierId,
      phoneNumbers: data.phoneNumbers,
      accountName: data.accountName,
      serviceAddress: data.serviceAddress,
      currentProvider: data.currentProvider,
      accountNumber: data.accountNumber,
      pin: data.pin,
      status: PortRequestStatus.DRAFT,
    });

    return this.portRequestRepository.save(portRequest);
  }
  // --------------------------------------------------
  // Get All Port Requests
  // --------------------------------------------------

  async findAll(status?: PortRequestStatus) {
    const where = status ? { status } : {};

    return this.portRequestRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }
  // --------------------------------------------------
  // Get One
  // --------------------------------------------------

  async findOne(id: string) {
    const portRequest = await this.portRequestRepository.findOne({
      where: {
        id,
      },
    });

    if (!portRequest) {
      throw new NotFoundException(`Port request not found: ${id}`);
    }

    return portRequest;
  }
  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  async submit(id: string) {
    const portRequest = await this.findOne(id);

    if (
      portRequest.status !== PortRequestStatus.DRAFT &&
      portRequest.status !== PortRequestStatus.REJECTED
    ) {
      throw new BadRequestException(
        `Port request cannot be submitted from ${portRequest.status} status`,
      );
    }

    portRequest.status = PortRequestStatus.SUBMITTED;

    portRequest.rejectionReason = undefined;

    portRequest.submittedAt = new Date();

    return this.portRequestRepository.save(portRequest);
  }
  // --------------------------------------------------
  // Confirm Port Date / FOC
  // --------------------------------------------------

  async confirmDate(id: string, confirmedPortDate: string) {
    const portRequest = await this.findOne(id);

    if (portRequest.status !== PortRequestStatus.SUBMITTED) {
      throw new BadRequestException(
        'Only submitted port requests can have a confirmed date',
      );
    }

    const date = new Date(confirmedPortDate);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid confirmed port date');
    }

    portRequest.status = PortRequestStatus.DATE_CONFIRMED;

    portRequest.confirmedPortDate = date;

    return this.portRequestRepository.save(portRequest);
  }
  // --------------------------------------------------
  // Reject
  // --------------------------------------------------

  async reject(id: string, rejectionReason: string) {
    const portRequest = await this.findOne(id);

    if (
      portRequest.status !== PortRequestStatus.SUBMITTED &&
      portRequest.status !== PortRequestStatus.DATE_CONFIRMED
    ) {
      throw new BadRequestException(
        `Port request cannot be rejected from ${portRequest.status} status`,
      );
    }

    if (!rejectionReason?.trim()) {
      throw new BadRequestException('Rejection reason is required');
    }

    portRequest.status = PortRequestStatus.REJECTED;

    portRequest.rejectionReason = rejectionReason;

    return this.portRequestRepository.save(portRequest);
  }
  // --------------------------------------------------
  // Cancel
  // --------------------------------------------------

  async cancel(id: string) {
    const portRequest = await this.findOne(id);

    if (
      portRequest.status === PortRequestStatus.COMPLETED ||
      portRequest.status === PortRequestStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Port request cannot be cancelled from ${portRequest.status} status`,
      );
    }

    portRequest.status = PortRequestStatus.CANCELLED;

    return this.portRequestRepository.save(portRequest);
  }

  // --------------------------------------------------
  // Complete
  // --------------------------------------------------

  async complete(id: string) {
    const portRequest = await this.findOne(id);

    if (portRequest.status !== PortRequestStatus.DATE_CONFIRMED) {
      throw new BadRequestException(
        'Only a port request with a confirmed date can be completed',
      );
    }

    const customerRepository =
      this.portRequestRepository.manager.getRepository(Customer);

    const carrierRepository =
      this.portRequestRepository.manager.getRepository(Carrier);

    const phoneNumberRepository =
      this.portRequestRepository.manager.getRepository(PhoneNumber);

    const customer = await customerRepository.findOne({
      where: {
        id: portRequest.customerId,
      },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer not found: ${portRequest.customerId}`,
      );
    }

    const carrier = await carrierRepository.findOne({
      where: {
        id: portRequest.carrierId,
      },
    });

    if (!carrier) {
      throw new NotFoundException(
        `Carrier not found: ${portRequest.carrierId}`,
      );
    }

    const completedNumbers: PhoneNumber[] = [];

    for (const phoneNumberValue of portRequest.phoneNumbers) {
      let phoneNumber = await phoneNumberRepository.findOne({
        where: {
          phoneNumber: phoneNumberValue,
        },
      });

      if (phoneNumber) {
        if (phoneNumber.status === PhoneNumberStatus.ASSIGNED) {
          throw new BadRequestException(
            `Phone number ${phoneNumberValue} is already assigned`,
          );
        }

        if (phoneNumber.status === PhoneNumberStatus.DISCONNECTED) {
          throw new BadRequestException(
            `Phone number ${phoneNumberValue} is disconnected`,
          );
        }

        phoneNumber.customerId = customer.id;

        phoneNumber.carrierId = carrier.id;

        phoneNumber.status = PhoneNumberStatus.ASSIGNED;

        phoneNumber.dateObtained = new Date();
      } else {
        phoneNumber = phoneNumberRepository.create({
          phoneNumber: phoneNumberValue,

          carrierId: carrier.id,

          status: PhoneNumberStatus.ASSIGNED,

          customerId: customer.id,

          dateObtained: new Date(),
        });
      }

      const savedNumber = await phoneNumberRepository.save(phoneNumber);

      completedNumbers.push(savedNumber);

      await this.historyService.create({
        phoneNumberId: savedNumber.id,

        phoneNumber: savedNumber.phoneNumber,

        action: HistoryAction.PORTED_IN,

        toCustomerId: customer.id,

        performedBy: 'MOCK_CARRIER',

        metadata: {
          portRequestId: portRequest.id,

          carrierId: carrier.id,

          carrier: carrier.name,

          currentProvider: portRequest.currentProvider,
        },
      });
    }

    portRequest.status = PortRequestStatus.COMPLETED;

    portRequest.completedAt = new Date();

    const savedRequest = await this.portRequestRepository.save(portRequest);

    return {
      portRequest: savedRequest,
      numbers: completedNumbers,
    };
  }
}
