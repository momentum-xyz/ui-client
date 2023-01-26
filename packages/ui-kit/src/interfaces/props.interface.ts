import {ReactNode} from 'react';

import {ThemeInterface} from './theme.interface';

export interface PropsWithThemeInterface {
  theme?: ThemeInterface;
  children?: ReactNode;
}
