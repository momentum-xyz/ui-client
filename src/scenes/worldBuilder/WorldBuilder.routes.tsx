import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

import {StartPage, WorldNamePage} from './pages';

export const WORLD_BUILDER_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.worldBuilder.start,
    exact: true,
    main: () => <StartPage />
  },
  {
    path: ROUTES.worldBuilder.name,
    exact: true,
    main: () => <WorldNamePage />
  }
];
