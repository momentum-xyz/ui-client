export interface NavigationTabInterface {
  path: string;
  iconName: IconName;
  title: string;
  isActive?: boolean;
  replace?: boolean;
  canGoBack?: boolean;
  exact?: boolean;
}
