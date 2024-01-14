import { Module } from '@nestjs/common';
import { RnService } from './rn.service';
import { RnController } from './rn.controller';
import { DatabaseModule } from '@app/common';
import { NativeBindedBundles } from './rn-native-bind.entity';
import { RNBundleHistory } from './rn-bundle-history.entity';

@Module({
  providers: [
    {
      provide: 'RN_BUNDLE_HISTORY_REPOSITORY',
      useFactory: (AppDataSource) =>
        AppDataSource.getRepository(RNBundleHistory),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
    {
      provide: 'NATIVE_BINDED_BUNDLES',
      useFactory: (AppDataSource) =>
        AppDataSource.getRepository(NativeBindedBundles),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
    RnService,
  ],
  imports: [DatabaseModule],
  controllers: [RnController],
})
export class RnModule { }
