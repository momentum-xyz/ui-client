import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import {render, within} from 'utils/test.utils';

import {NavigationBarItem} from '../../molecules';

import NavigationBar from './NavigationBar';

describe('NavigationBar', () => {
  test('renders', () => {
    const navigationBar = render(<NavigationBar />);

    expect(navigationBar.baseElement).not.toBeNull();
  });

  test('renders with item', () => {
    const renderResult = render(
      <BrowserRouter>
        <NavigationBar>
          <NavigationBarItem iconName="tiles" path="" />
        </NavigationBar>
      </BrowserRouter>
    );

    expect(
      within(renderResult.baseElement).queryAllByTestId('NavigationBarItem-test')
    ).toHaveLength(1);
  });
});
