import { Injectable } from '@nestjs/common';

import { CarrierAdapter } from '../interfaces/carrier-adapter.interface';
import { BULKVS_MOCK_NUMBERS } from '../mocks/bulkvs.mock';

@Injectable()
export class BulkvsAdapter implements CarrierAdapter {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getNumbers() {
    return BULKVS_MOCK_NUMBERS;
  }
}
