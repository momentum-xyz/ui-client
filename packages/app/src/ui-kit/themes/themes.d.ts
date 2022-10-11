import {ThemeInterface} from '@momentum/ui-kit';

// extends the global DefaultTheme with our ThemeInterface
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface DefaultTheme extends ThemeInterface {}
}
