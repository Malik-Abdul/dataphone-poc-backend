import { CarrierNumber } from '../interfaces/carrier-adapter.interface';

export const BANDWIDTH_MOCK_NUMBERS: CarrierNumber[] = [
  {
    phoneNumber: '+17185553001',
    status: 'ACTIVE',
    city: 'New York',
    state: 'NY',
    dateObtained: new Date('2026-02-01'),
  },
  {
    phoneNumber: '+17185553002',
    status: 'AVAILABLE',
    city: 'Brooklyn',
    state: 'NY',
  },
  {
    phoneNumber: '+17185553003',
    status: 'ACTIVE',
    city: 'Queens',
    state: 'NY',
    dateObtained: new Date('2026-03-12'),
  },
];
