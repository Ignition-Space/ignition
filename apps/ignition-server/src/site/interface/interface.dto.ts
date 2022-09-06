import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GenerateDto {
  @ApiProperty({ example: '6263f15f6d160033b35061d7' })
  @IsNotEmpty()
  id: string;
}
