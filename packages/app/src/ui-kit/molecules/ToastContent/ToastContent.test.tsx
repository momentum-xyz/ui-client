import React from 'react';

import {render} from 'ui-kit/utils/test.utils';

import ToastContent from './ToastContent';

describe('ToastContent', () => {
  it('renders', () => {
    const itemLayout = render(<ToastContent text="TEXT" />);

    expect(itemLayout.baseElement).not.toBeNull();
  });
});
