import { Test, TestingModule } from '@nestjs/testing';
import { PublicConversationController } from './public-conversation.controller';

describe('PublicConversationController', () => {
  let controller: PublicConversationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicConversationController],
    }).compile();

    controller = module.get<PublicConversationController>(PublicConversationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
