import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

import {BasicAssetsPackPage, CustomAssetsLibraryPage, UploadCustomAssetPage} from './pages';

export const SPAWN_ASSET_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.odyssey.builder.spawnAsset.basicAssets,
    main: () => <BasicAssetsPackPage />
  },
  {
    path: ROUTES.odyssey.builder.spawnAsset.customAssets,
    main: () => <CustomAssetsLibraryPage />
  },
  {
    path: ROUTES.odyssey.builder.spawnAsset.uploadAsset,
    main: () => <UploadCustomAssetPage />
  }
];
