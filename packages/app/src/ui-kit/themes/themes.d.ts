import {ThemeInterface} from '@momentum-xyz/ui-kit';

// extends the global DefaultTheme with our ThemeInterface
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface DefaultTheme extends ThemeInterface {}
}
