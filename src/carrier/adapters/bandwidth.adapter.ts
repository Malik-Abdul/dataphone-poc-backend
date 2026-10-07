import { Injectable } from '@nestjs/common';

import { CarrierAdapter } from '../interfaces/carrier-adapter.interface';
import { BANDWIDTH_MOCK_NUMBERS } from '../mocks/bandwidth.mock';

@Injectable()
export class BandwidthAdapter implements CarrierAdapter {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getNumbers() {
    return BANDWIDTH_MOCK_NUMBERS;
  }
}
