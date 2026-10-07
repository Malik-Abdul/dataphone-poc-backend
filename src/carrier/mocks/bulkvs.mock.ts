import { CarrierNumber } from '../interfaces/carrier-adapter.interface';

export const BULKVS_MOCK_NUMBERS: CarrierNumber[] = [
  {
    phoneNumber: '+17185552001',
    status: 'ACTIVE',
    city: 'Brooklyn',
    state: 'NY',
    dateObtained: new Date('2026-01-20'),
  },
  {
    phoneNumber: '+17185552002',
    status: 'AVAILABLE',
    city: 'Queens',
    state: 'NY',
  },
  {
    phoneNumber: '+17185552003',
    status: 'DISCONNECTED',
    city: 'Brooklyn',
    state: 'NY',
    dateObtained: new Date('2025-12-05'),
  },
];
