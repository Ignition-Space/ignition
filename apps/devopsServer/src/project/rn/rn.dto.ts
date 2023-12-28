import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Platform } from './rn-bundle-history.entity';
import { BundleUseStrategy } from './rn-native-bind.entity';

export class RNBundle {
  @IsNotEmpty()
  projectName: string;

  @IsNotEmpty()
  projectId: number;

  @IsNotEmpty()
  moduleNames: string;

  @IsNotEmpty()
  downloadUrl: string;

  @IsNotEmpty()
  version: string;

  @IsNotEmpty()
  platform: Platform;

  @IsNotEmpty()
  md5: string;
}

export class RNBundleHistoryWithPaginationDto {
  @ApiProperty({ example: { pageSize: 10, currentPage: 1 } })
  page?: PaginationParams;
}

export class GetRNProjectBundleListDto {
  @IsNotEmpty()
  projectId: number;
  @IsNotEmpty()
  platform: Platform;
}

export class NativeBindedBundlesDto {
  @IsNotEmpty()
  nativeProjectId: number;
  @IsNotEmpty()
  platform: Platform;
}
export class BindRNProjectBundleDto {
  bindedId?: number;
  @IsNotEmpty()
  nativeProjectId: number;
  @IsNotEmpty()
  projectId: number;
  @IsNotEmpty()
  platform: Platform;
  @IsNotEmpty()
  moduleNames: string;
  useStrategy: BundleUseStrategy;

  version: string;
}

export class UnbindRNProjectBundleDto {
  @IsNotEmpty()
  bindedId: number;
}

export class BundleVersionsDto {
  @IsNotEmpty()
  projectId: number;
  @IsNotEmpty()
  moduleNames: string;
  @IsNotEmpty()
  platform: Platform;
}

export class EditBindedBundleDto {
  @IsNotEmpty()
  bindedId: number;
  @IsNotEmpty()
  useStrategy: BundleUseStrategy;
  version: string;
}
