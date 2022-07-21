export interface RouteConfigInterface {
  path: string;
  exact?: boolean;
  main: () => JSX.Element | null;
  renderBackground?: boolean;
}
