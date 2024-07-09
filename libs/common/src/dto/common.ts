import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    type: 'number',
    default: 10,
  })
  pageSize: number;

  @ApiProperty({
    type: 'number',
    default: 1,
  })
  pageNum: number;
}
