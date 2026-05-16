import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseCharts } from './database-charts';

describe('DatabaseCharts', () => {
  let provider: DatabaseCharts;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseCharts],
    }).compile();

    provider = module.get<DatabaseCharts>(DatabaseCharts);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
