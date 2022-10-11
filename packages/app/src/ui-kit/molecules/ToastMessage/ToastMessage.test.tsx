import React from 'react';

import {render} from 'ui-kit/utils/test.utils';

import ToastMessage from './ToastMessage';

describe('ToastMessage', () => {
  it('renders', () => {
    const itemLayout = render(<ToastMessage />);

    expect(itemLayout.baseElement).not.toBeNull();
  });
});
