import { RNBundleHistory } from './rn-bundle-history.entity';
import { NativeBindedBundles } from './rn-native-bind.entity';

export const rnProviders = [
  {
    provide: 'RN_BUNDLE_HISTORY_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(RNBundleHistory),
    inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
  },
  {
    provide: 'NATIVE_BINDED_BUNDLES',
    useFactory: (AppDataSource) =>
      AppDataSource.getRepository(NativeBindedBundles),
    inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
  },
];
