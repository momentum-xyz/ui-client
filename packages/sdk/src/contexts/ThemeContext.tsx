import {DefaultThemeConfig, ThemeInterface} from '@momentum-xyz/ui-kit';
import {createContext, useContext} from 'react';

export const ThemeContext = createContext<ThemeInterface>(DefaultThemeConfig);

export const ThemeContextProvider: React.FC<{theme: ThemeInterface}> = ({theme, children}) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
