import {ROUTES} from 'core/constants';

import {SkyboxSelectorWithPreview, UploadAsset} from './components';

export const WORLD_BUILDER_ROUTES = [
  {
    path: ROUTES.odyssey.builder.skybox,
    main: () => <SkyboxSelectorWithPreview />,
    exact: true
  },
  {
    path: ROUTES.odyssey.builder.uploadAsset,
    main: () => <UploadAsset />,
    exact: true
  }
];
