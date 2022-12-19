import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';
import {Asset3dCategoryEnum} from 'api/enums';

import {AssetsPage, SelectedPage, UploadCustomAssetPage} from './pages';

export const SPAWN_ASSET_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.odyssey.builder.spawnAsset.basicAssets,
    main: () => <AssetsPage assetCategory={Asset3dCategoryEnum.BASIC} />,
    exact: true
  },
  {
    path: ROUTES.odyssey.builder.spawnAsset.customAssets,
    main: () => <AssetsPage assetCategory={Asset3dCategoryEnum.CUSTOM} />,
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
