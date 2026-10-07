/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
// src/carrier/carrier.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Carrier, CarrierCode } from './entities/carrier.entity';

import { PeerlessAdapter } from './adapters/peerless.adapter';
import { BulkvsAdapter } from './adapters/bulkvs.adapter';
import { BandwidthAdapter } from './adapters/bandwidth.adapter';

import { PhoneNumbersService } from '../phone-numbers/phone-numbers.service';

@Injectable()
export class CarrierService {
  constructor(
    @InjectRepository(Carrier)
    private readonly carrierRepository: Repository<Carrier>,

    private readonly peerlessAdapter: PeerlessAdapter,
    private readonly bulkvsAdapter: BulkvsAdapter,
    private readonly bandwidthAdapter: BandwidthAdapter,

    private readonly phoneNumbersService: PhoneNumbersService,
  ) {}

  async getNumbers(carrier: string) {
    switch (carrier.toUpperCase()) {
      case CarrierCode.PEERLESS:
        return this.peerlessAdapter.getNumbers();

      case CarrierCode.BULKVS:
        return this.bulkvsAdapter.getNumbers();

      case CarrierCode.BANDWIDTH:
        return this.bandwidthAdapter.getNumbers();

      default:
        throw new NotFoundException(`Unsupported carrier: ${carrier}`);
    }
  }

  async syncNumbers(carrierCode: string) {
    const code = carrierCode.toUpperCase() as CarrierCode;

    const carrier = await this.carrierRepository.findOne({
      where: {
        code,
      },
    });

    if (!carrier) {
      throw new NotFoundException(`Carrier not found: ${carrierCode}`);
    }

    const numbers = await this.getNumbers(code);

    const count = await this.phoneNumbersService.upsertNumbers(
      carrier.id,
      numbers,
    );

    return {
      carrier: carrier.name,
      synced: count,
    };
  }
}
