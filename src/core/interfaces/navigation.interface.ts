export interface NavigationTabInterface {
  path: string;
  iconName: IconName;
  isActive?: boolean;
  isHide?: boolean;
  replace?: boolean;
  canGoBack?: boolean;
  exact?: boolean;
}
