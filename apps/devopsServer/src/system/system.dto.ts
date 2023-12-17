import { ApiProperty } from '@nestjs/swagger';

export class CreatSystemDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 'web' })
  type: string;

  @ApiProperty({ example: 'fe-h5-deploy-devops' })
  jenkinsJob: string;

  @ApiProperty({ example: 'fe-publisher:0.0.12' })
  docker: string;
}
