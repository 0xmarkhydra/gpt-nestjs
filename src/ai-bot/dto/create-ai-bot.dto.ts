import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiBotDto {
    @ApiProperty({ required: true, description: 'key', default: '' })
    question: string

    @ApiPropertyOptional({ required: true, description: 'key', default: '' })
    thread_id: string
}

export class CrawlWebDto {
    @ApiPropertyOptional({ required: true, description: 'key', default: '' })
    url?: string
}
