import {ROUTES} from 'core/constants';

import {SkyboxSelectorWithPreview, UploadAsset} from '../../components';

export const WORLD_BUILDER_ROUTES = [
  {
    path: ROUTES.worldBuilder.builderSkybox,
    main: () => <SkyboxSelectorWithPreview />,
    exact: true
  },
  {
    path: ROUTES.worldBuilder.builderUploadAsset,
    main: () => <UploadAsset />,
    exact: true
  }
];
