import { DataSource } from 'typeorm';

import { Carrier, CarrierCode } from '../../carrier/entities/carrier.entity';

export async function seedCarriers(dataSource: DataSource): Promise<void> {
  const carrierRepository = dataSource.getRepository(Carrier);

  const carriers = [
    {
      name: 'Peerless Network',
      code: CarrierCode.PEERLESS,
    },
    {
      name: 'BulkVS',
      code: CarrierCode.BULKVS,
    },
    {
      name: 'Bandwidth',
      code: CarrierCode.BANDWIDTH,
    },
  ];

  for (const carrier of carriers) {
    const existing = await carrierRepository.findOne({
      where: {
        code: carrier.code,
      },
    });

    if (existing) {
      continue;
    }

    await carrierRepository.save(carrierRepository.create(carrier));
  }
}
