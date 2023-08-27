import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class addDeployConfigDto {
  @ApiProperty({ default: '123' })
  @IsNotEmpty()
  pageId: string;

  @ApiProperty({ default: '{}' })
  @IsNotEmpty()
  config: string;

  @ApiProperty({ default: '0.0.1' })
  @IsNotEmpty()
  version: string;
}

export class updateDeployConfigDto extends addDeployConfigDto {
  @ApiProperty({ default: '1' })
  @IsNotEmpty()
  id: string;
}

export class findOneDeployConfigDto {
  @ApiProperty({ default: '1' })
  @IsNotEmpty()
  id: string;
}
