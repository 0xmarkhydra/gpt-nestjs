import { Test, TestingModule } from '@nestjs/testing';
import { AiBotService } from './ai-bot.service';

describe('AiBotService', () => {
  let service: AiBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiBotService],
    }).compile();

    service = module.get<AiBotService>(AiBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
