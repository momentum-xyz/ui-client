import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

import {
  WorldBuilderStartPage,
  WorldBuilderNamePage,
  WorldBuilderTemplatePage,
  WorldBuilderGeneratePage
} from './pages';

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
  },
  {
    path: ROUTES.worldBuilder.template,
    exact: true,
    main: () => <WorldBuilderTemplatePage />
  },
  {
    path: ROUTES.worldBuilder.generate,
    exact: true,
    main: () => <WorldBuilderGeneratePage />
  }
];
