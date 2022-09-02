import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

import {WorldBuilderStartPage, WorldBuilderNamePage} from './pages';

export const WORLD_BUILDER_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.worldBuilder.start,
    exact: true,
    main: () => <WorldBuilderStartPage />
  },
  {
    path: ROUTES.worldBuilder.name,
    exact: true,
    main: () => <WorldBuilderNamePage />
  }
];
