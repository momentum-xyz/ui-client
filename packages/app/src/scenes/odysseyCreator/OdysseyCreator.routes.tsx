import {ROUTES} from 'core/constants';

import {ObjectFunctionalityPage} from './pages/ObjectFunctionalityPage';
import {SkyboxSelectorWithPreviewPage} from './pages/SkyboxSelectorWithPreviewPage';
import {SpawnAssetPage} from './pages/SpawnAssetPage';

export const ODYSSEY_CREATOR_ROUTES = [
  {
    path: ROUTES.odyssey.creator.base,
    main: () => <></>,
    exact: true
  },
  {
    path: ROUTES.odyssey.creator.skybox,
    main: () => <SkyboxSelectorWithPreviewPage />,
    exact: true
  },
  {
    path: ROUTES.odyssey.creator.spawnAsset.base,
    main: () => <SpawnAssetPage />,
    exact: false
  },
  {
    path: ROUTES.odyssey.creator.functionality,
    main: () => <ObjectFunctionalityPage />,
    exact: false
  }
];
