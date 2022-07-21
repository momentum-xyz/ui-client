export interface NavigationTabInterface {
  path: string;
  iconName: IconName;
  isActive?: boolean;
  replace?: boolean;
  canGoBack?: boolean;
  exact?: boolean;
}
