import React from 'react';

import {render} from 'ui-kit/utils/test.utils';

import PanelLayout from './PanelLayout';

describe('PanelLayout', () => {
  it('renders', () => {
    const itemLayout = render(<PanelLayout />);

    expect(itemLayout.baseElement).not.toBeNull();
  });
});
