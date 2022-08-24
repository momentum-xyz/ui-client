export interface NavigationTabInterface {
  path: string;
  iconName: IconName;
  isActive?: boolean;
  isHidden?: boolean;
  replace?: boolean;
  canGoBack?: boolean;
  exact?: boolean;
}
