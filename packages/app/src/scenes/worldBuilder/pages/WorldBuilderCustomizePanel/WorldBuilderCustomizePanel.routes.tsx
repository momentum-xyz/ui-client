import {ROUTES} from 'core/constants';
import {SpawnAsset, EditObject} from 'scenes/worldBuilder/components';

import {SkyboxSelectorWithPreview} from '../../components';

export const WORLD_BUILDER_ROUTES = [
  {
    path: ROUTES.odyssey.builder.base,
    main: () => <></>,
    exact: true
  },
  {
    path: ROUTES.odyssey.builder.skybox,
    main: () => <SkyboxSelectorWithPreview />,
    exact: true
  },
  {
    path: ROUTES.odyssey.builder.spawnAsset.base,
    main: () => <SpawnAsset />,
    exact: false
  },
  {
    path: ROUTES.odyssey.builder.editor,
    main: () => <EditObject />,
    exact: false
  }
];
