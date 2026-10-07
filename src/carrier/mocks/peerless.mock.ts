import { CarrierNumber } from '../interfaces/carrier-adapter.interface';

export const PEERLESS_MOCK_NUMBERS: CarrierNumber[] = [
  {
    phoneNumber: '+17185551001',
    status: 'ACTIVE',
    city: 'Brooklyn',
    state: 'NY',
    dateObtained: new Date('2026-01-15'),
  },
  {
    phoneNumber: '+17185551002',
    status: 'AVAILABLE',
    city: 'Brooklyn',
    state: 'NY',
  },
  {
    phoneNumber: '+17185551003',
    status: 'ACTIVE',
    city: 'New York',
    state: 'NY',
    dateObtained: new Date('2026-02-10'),
  },
];
