import {ThemeInterface} from 'ui-kit/interfaces';

// extends the global DefaultTheme with our ThemeInterface
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeInterface {}
}
