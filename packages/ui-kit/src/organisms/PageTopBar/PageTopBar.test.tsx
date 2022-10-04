import React from 'react';

import {render} from 'utils/test.utils';

import PageTopBar from './PageTopBar';

describe('PageTopBar', () => {
  test('renders', () => {
    const topBar = render(<PageTopBar title="" />);

    expect(topBar.baseElement).not.toBeNull();
  });
});
