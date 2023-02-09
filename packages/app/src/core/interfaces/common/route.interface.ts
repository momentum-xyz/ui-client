export interface RouteConfigInterface {
  path: string;
  exact?: boolean;
  main: () => JSX.Element | null;
}

export interface ProtectedRouteInterface {
  path: string;
  exact?: boolean;
  defaultRedirect?: string;
  hasRights?: () => boolean;
}

export interface ProtectedRouteListInterface {
  routes: RouteConfigInterface[];
  defaultRedirect?: string;
  hasRights?: () => boolean;
}
