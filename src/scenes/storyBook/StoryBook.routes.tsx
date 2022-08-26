import React from 'react';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

import {AtomsPage, MoleculesPage, OrganismsPage, TemplatesPage} from './pages';

export const STORYBOOK_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.storyBook.atoms,
    exact: true,
    main: () => <AtomsPage />
  },
  {
    path: ROUTES.storyBook.molecules,
    exact: true,
    main: () => <MoleculesPage />
  },
  {
    path: ROUTES.storyBook.organisms,
    exact: true,
    main: () => <OrganismsPage />
  },
  {
    path: ROUTES.storyBook.templates,
    exact: true,
    main: () => <TemplatesPage />
  }
];
