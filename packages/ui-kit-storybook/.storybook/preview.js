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
    name: 'Light theme',
    viewportBg: '#EAD6E5',
    ...DefaultThemeConfig
  },
  {
    name: 'Dark theme',
    viewportBg: '#333333',
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
