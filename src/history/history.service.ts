import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { History, HistoryAction } from './entities/history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async create(data: {
    phoneNumberId: string;
    phoneNumber: string;
    action: HistoryAction;
    fromCustomerId?: string;
    toCustomerId?: string;
    performedBy?: string;
    metadata?: Record<string, any>;
  }) {
    const history = this.historyRepository.create(data);

    return this.historyRepository.save(history);
  }

  async findByPhoneNumber(phoneNumberId: string) {
    return this.historyRepository.find({
      where: {
        phoneNumberId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
