import { Test, TestingModule } from '@nestjs/testing';
import { PortRequestsController } from './port-requests.controller';

describe('PortRequestsController', () => {
  let controller: PortRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortRequestsController],
    }).compile();

    controller = module.get<PortRequestsController>(PortRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
