import { Test, TestingModule } from '@nestjs/testing';
import { PortRequestsService } from './port-requests.service';

describe('PortRequestsService', () => {
  let service: PortRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortRequestsService],
    }).compile();

    service = module.get<PortRequestsService>(PortRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
