import {ReactElement} from 'react';

export interface RouteConfigInterface {
  path: string;
  exact?: boolean;
  sidebar?: () => JSX.Element | null;
  main: () => JSX.Element | null;
  renderBackground?: boolean;
}

export interface RouteElementInterface {
  [index: number]: RouteElementInterface | ReactElement | undefined;
}
