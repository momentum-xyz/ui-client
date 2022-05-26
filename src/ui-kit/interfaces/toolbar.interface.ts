export interface ToolbarIconInterface {
  title: string;
  link?: string;
  icon?: IconName;
  // @ts-ignore: add types
  isActive?: (match, location) => boolean;
  onClick?: () => void;
  disabled?: boolean;
}
