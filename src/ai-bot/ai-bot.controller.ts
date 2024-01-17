import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiBotService } from './ai-bot.service';
import { CrawlWebDto, CreateAiBotDto } from './dto/create-ai-bot.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Ai-bot')
@Controller('ai-bot')
export class AiBotController {
  constructor(private readonly aiBotService: AiBotService) {}

  @Post('create-chat')
  create(@Body() createAiBotDto: CreateAiBotDto) {
    return this.aiBotService.chat(createAiBotDto);
  }

  @Post('chat-thread')
  create1(@Body() createAiBotDto: CreateAiBotDto) {
    return this.aiBotService.chatByKeyAssistantV2(createAiBotDto);
  }
  
  @Post('crawl-web')
  crawlWeb(@Body() body: CrawlWebDto) {
    return this.aiBotService.crawlWeb(body.url);
  }
}
