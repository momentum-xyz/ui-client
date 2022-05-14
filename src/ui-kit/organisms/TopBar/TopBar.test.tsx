import React from 'react';

import {render} from 'ui-kit/utils/test.utils';

import TopBar from './TopBar';

describe('TopBar', () => {
  test('renders', () => {
    const topBar = render(<TopBar title="" />);

    expect(topBar.baseElement).not.toBeNull();
  });
});
