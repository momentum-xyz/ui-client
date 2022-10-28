import {ROUTES} from 'core/constants';

import {SkyboxSelectorWithPreview} from './components';

export const WORLD_BUILDER_ROUTES = [
  {
    path: ROUTES.worldBuilder.builderSkybox,
    main: () => <SkyboxSelectorWithPreview />,
    exact: true
  }
];
