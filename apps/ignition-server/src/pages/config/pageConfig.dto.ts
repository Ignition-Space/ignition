import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class addPageConfigDto {
  @ApiProperty({ default: '123' })
  @IsNotEmpty()
  pageId: string;

  @ApiProperty({ default: '{}' })
  @IsNotEmpty()
  config: string;

  @ApiProperty({ default: '0.0.1' })
  @IsNotEmpty()
  version: string;

  @IsNotEmpty()
  creator: string;

  @IsNotEmpty()
  creatorId: string;
}

export class updatePageConfigDto extends addPageConfigDto {
  @ApiProperty({ default: '1' })
  @IsNotEmpty()
  id: string;
}

export class findOnePageConfigDto {
  @ApiProperty({ default: '1' })
  @IsNotEmpty()
  id: string;
}
