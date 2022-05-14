export interface ToolbarIconInterface {
  title: string;
  link?: string;
  icon?: IconName;
  isActive?: (match, location) => boolean;
  onClick?: () => void;
  disabled?: boolean;
}
