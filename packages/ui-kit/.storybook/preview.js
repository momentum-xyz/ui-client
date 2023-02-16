import {ThemeProvider} from 'styled-components';
import {addDecorator} from '@storybook/react';
import {withThemes} from '@react-theming/storybook-addon';
import {DefaultThemeConfig, CustomThemeConfig} from '../src';

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};

const themes = [
  {
    name: 'Base theme',
    viewportBg: '#4F5C7C',
    ...DefaultThemeConfig
  },
  {
    name: 'Custom theme',
    viewportBg: '#28335F',
    ...CustomThemeConfig
  }
];

export const onThemeSwitch = (context) => {
  return {
    parameters: {
      backgrounds: {
        default: context.theme.viewportBg
      }
    }
  };
};

addDecorator(withThemes(ThemeProvider, themes, {onThemeSwitch}));
