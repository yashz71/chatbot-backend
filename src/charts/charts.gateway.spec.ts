import { Test, TestingModule } from '@nestjs/testing';
import { ChartsGateway } from './charts.gateway';
import { ChartsService } from './charts.service';

describe('ChartsGateway', () => {
  let gateway: ChartsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChartsGateway, ChartsService],
    }).compile();

    gateway = module.get<ChartsGateway>(ChartsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
