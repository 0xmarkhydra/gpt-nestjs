import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiBotDto {
    @ApiProperty({ required: true, description: 'key', default: '' })
    question: string
}
