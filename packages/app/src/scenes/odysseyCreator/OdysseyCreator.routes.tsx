import {ROUTES} from 'core/constants';
import {
  SkyboxSelectorWithPreviewPage,
  ObjectFunctionalityPage,
  SpawnAssetPage
} from 'scenes/odysseyCreator/pages';

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
