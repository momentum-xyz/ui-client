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
    name: 'Default theme',
    previewBg: '#8F94A1',
    ...DefaultThemeConfig
  },
  {
    name: 'Custom theme',
    previewBg: '#D0E5E5',
    ...CustomThemeConfig
  }
];

export const onThemeSwitch = (context) => {
  const {theme} = context;
  return {
    parameters: {
      backgrounds: {
        default: theme.previewBg
      }
    }
  };
};

addDecorator(withThemes(ThemeProvider, themes, {onThemeSwitch}));
