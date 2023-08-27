import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { PaginationParams } from "types/type";

export class CreateResourceDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'test', description: '资源信息' })
  name: string;

  @ApiProperty({ example: '', description: '父级资源ID' })
  parentId?: number;

  @IsNotEmpty()
  @ApiProperty({ example: '2', description: '系统ID' })
  systemId: number;

  @ApiProperty({ example: 'test', description: '系统标识' })
  key: string;
}

export class ListBySystemIdDto {
  @IsNotEmpty()
  @ApiProperty({ example: '2', description: '系统ID' })
  systemId: number;
}

export class DeleteResourceDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1', description: '资源ID' })
  id: number;
}

export class UpdateResourceDto extends CreateResourceDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1', description: '资源ID' })
  id: number;
}


export class ResourceListWithPaginationDto {
  @ApiProperty({ example: '', description: '查询关键词' })
  keyword?: string;

  @ApiProperty({ example: { pageSize: 10, currentPage: 1 } })
  page?: PaginationParams;
}