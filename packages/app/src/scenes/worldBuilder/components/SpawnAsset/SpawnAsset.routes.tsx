import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

import {
  BasicAssetsPackPage,
  CustomAssetsLibraryPage,
  SelectedPage,
  UploadCustomAssetPage
} from './pages';

export const SPAWN_ASSET_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.odyssey.builder.spawnAsset.basicAssets,
    main: () => <BasicAssetsPackPage />,
    exact: true
  },
  {
    path: ROUTES.odyssey.builder.spawnAsset.customAssets,
    main: () => <CustomAssetsLibraryPage />,
    exact: true
  },
  {
    path: ROUTES.odyssey.builder.spawnAsset.uploadAsset,
    main: () => <UploadCustomAssetPage />,
    exact: true
  },
  {
    path: ROUTES.odyssey.builder.spawnAsset.selected,
    main: () => <SelectedPage />,
    exact: true
  }
];
