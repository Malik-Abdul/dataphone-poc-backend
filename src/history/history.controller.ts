import { Controller, Get, Param } from '@nestjs/common';

import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('phone-numbers/:phoneNumberId')
  async findByPhoneNumber(@Param('phoneNumberId') phoneNumberId: string) {
    return this.historyService.findByPhoneNumber(phoneNumberId);
  }
}
