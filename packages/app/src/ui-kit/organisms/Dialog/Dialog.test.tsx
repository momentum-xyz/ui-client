import React from 'react';

import {render} from 'ui-kit/utils/test.utils';

import Dialog from './Dialog';

describe('Dialog', () => {
  it('renders', () => {
    const itemLayout = render(<Dialog title="" />);

    expect(itemLayout.baseElement).not.toBeNull();
  });
});
