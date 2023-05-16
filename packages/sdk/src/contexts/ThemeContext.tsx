import {DefaultThemeConfig, ThemeInterface} from '@momentum-xyz/ui-kit-storybook';
import {createContext, ReactNode, useContext} from 'react';

export const ThemeContext = createContext<ThemeInterface>(DefaultThemeConfig);

export const ThemeContextProvider: React.FC<{theme: ThemeInterface; children?: ReactNode}> = ({
  theme,
  children
}) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
