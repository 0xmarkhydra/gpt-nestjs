import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiBotModule } from './ai-bot/ai-bot.module';

@Module({
  imports: [AiBotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
