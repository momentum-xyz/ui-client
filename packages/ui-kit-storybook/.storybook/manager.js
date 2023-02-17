import {addons} from '@storybook/addons';
import {create} from '@storybook/theming';

import logo from '../src/static/images/odyssey.svg';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Odyssey storybook',
    brandUrl: 'https://odyssey.org',
    brandImage: logo,
    brandTarget: '_blank'
  })
});
