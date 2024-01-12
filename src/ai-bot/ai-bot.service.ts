import { Injectable } from '@nestjs/common';
import { CreateAiBotDto } from './dto/create-ai-bot.dto';
import { UpdateAiBotDto } from './dto/update-ai-bot.dto';

@Injectable()
export class AiBotService {
  create(createAiBotDto: CreateAiBotDto) {
    return 'This action adds a new aiBot';
  }

  findAll() {
    return `This action returns all aiBot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiBot`;
  }

  update(id: number, updateAiBotDto: UpdateAiBotDto) {
    return `This action updates a #${id} aiBot`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiBot`;
  }
}
