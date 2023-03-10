import {ThemeProvider} from 'styled-components';
import {addDecorator} from '@storybook/react';
import {withThemes} from '@react-theming/storybook-addon';

import {DefaultThemeConfig} from '../src';

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};

const THEMES = [
  {
    ...DefaultThemeConfig,
    name: 'Light theme',
    bg: '#FFF',
    text: '#000'
  },
  {
    ...DefaultThemeConfig,
    name: 'Odyssey theme'
  },
  {
    ...DefaultThemeConfig,
    name: 'Dark theme',
    bg: '#000',
    text: '#FFF'
  }
];

export const onThemeSwitch = (context) => {
  return {
    parameters: {
      backgrounds: {
        default: context.theme.bg
      }
    }
  };
};

addDecorator(withThemes(ThemeProvider, THEMES, {onThemeSwitch}));
