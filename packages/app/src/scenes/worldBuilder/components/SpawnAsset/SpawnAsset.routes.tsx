import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

import {BasicAssetsPackPage, CustomAssetsLibraryPage, UploadCustomAssetPage} from './pages';

export const SPAWN_ASSET_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.spawnAsset.basicAssets,
    main: () => <BasicAssetsPackPage />
  },
  {
    path: ROUTES.spawnAsset.customAssets,
    main: () => <CustomAssetsLibraryPage />
  },
  {
    path: ROUTES.spawnAsset.uploadAsset,
    main: () => <UploadCustomAssetPage />
  }
];
