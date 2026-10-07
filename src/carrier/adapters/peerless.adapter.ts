import { Injectable } from '@nestjs/common';

import { CarrierAdapter } from '../interfaces/carrier-adapter.interface';
import { PEERLESS_MOCK_NUMBERS } from '../mocks/peerless.mock';

@Injectable()
export class PeerlessAdapter implements CarrierAdapter {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getNumbers() {
    return PEERLESS_MOCK_NUMBERS;
  }
}
