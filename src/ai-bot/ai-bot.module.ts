import { Module } from '@nestjs/common';
import { AiBotService } from './ai-bot.service';
import { AiBotController } from './ai-bot.controller';

@Module({
  controllers: [AiBotController],
  providers: [AiBotService],
})
export class AiBotModule {}
