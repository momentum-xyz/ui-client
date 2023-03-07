import {ThemeInterface} from '../interfaces';

// extends the global DefaultTheme with our ThemeInterface
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeInterface {}
}
