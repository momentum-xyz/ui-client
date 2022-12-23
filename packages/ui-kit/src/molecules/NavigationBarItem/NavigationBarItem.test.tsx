import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import {render} from '../../utils/test.utils';

import NavigationBarItem from './NavigationBarItem';

describe('NavigationBarItem', () => {
  test('renders', () => {
    const avatarComponent = render(
      <BrowserRouter>
        <NavigationBarItem iconName="tiles" path="" />
      </BrowserRouter>
    );

    expect(avatarComponent.baseElement).not.toBeNull();
  });
});
