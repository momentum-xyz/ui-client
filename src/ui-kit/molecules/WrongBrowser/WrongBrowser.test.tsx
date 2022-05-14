import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';

import WrongBrowser from './WrongBrowser';

describe('WrongBrowser', () => {
  it('is rendered', () => {
    const rendered = render(<WrongBrowser title="" message="" browserList="" />);
    expect(within(rendered.baseElement).getByTestId('WrongBrowser-test')).not.toBeNull();
  });
});
