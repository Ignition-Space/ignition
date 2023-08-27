import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateSystemDto {
  @IsNotEmpty()
  @ApiProperty({ default: 'materials', description: '系统名称' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ default: '物料系统', description: '系统描述' })
  description: string;
}
export class DeleteSystemDto {
  @IsNotEmpty()
  @ApiProperty({ default: '1', description: '系统id' })
  id: number;
}

export class UpdateSystemDto {
  @IsNotEmpty()
  @ApiProperty({ default: '1', description: '系统id' })
  id: number;

  @IsNotEmpty()
  @ApiProperty({ default: 'materials', description: '系统名称' })
  name?: string;

  @ApiProperty({ default: '物料系统', description: '系统描述' })
  description?: string;
}
