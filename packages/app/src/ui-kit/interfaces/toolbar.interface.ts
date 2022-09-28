export interface ToolbarIconInterface {
  title: string;
  link?: string;
  icon?: IconNameType;
  // @ts-ignore: add types
  isActive?: (match, location) => boolean;
  onClick?: () => void;
  disabled?: boolean;
}
