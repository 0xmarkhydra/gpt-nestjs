import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiBotService } from './ai-bot.service';
import { CreateAiBotDto } from './dto/create-ai-bot.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Ai-bot')
@Controller('ai-bot')
export class AiBotController {
  constructor(private readonly aiBotService: AiBotService) {}

  @Post('chat')
  create(@Body() createAiBotDto: CreateAiBotDto) {
    return this.aiBotService.chat(createAiBotDto);
  }

  // @Get()
  // findAll() {
  //   return this.aiBotService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.aiBotService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAiBotDto: UpdateAiBotDto) {
  //   return this.aiBotService.update(+id, updateAiBotDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.aiBotService.remove(+id);
  // }
}
