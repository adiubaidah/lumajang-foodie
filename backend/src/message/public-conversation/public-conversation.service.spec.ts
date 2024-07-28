import { Test, TestingModule } from '@nestjs/testing';
import { PublicConversationService } from './public-conversation.service';

describe('PublicConversationService', () => {
  let service: PublicConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicConversationService],
    }).compile();

    service = module.get<PublicConversationService>(PublicConversationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
