import React from 'react';

import {render, within} from '../../utils/test.utils';

import IconSvg from './IconSvg';

describe('IconSvg', () => {
  it('is rendered', () => {
    const rendered = render(<IconSvg name="close_large" />);

    expect(within(rendered.baseElement).getByTestId('IconSvg-test')).not.toBeNull();
  });
});

export {};
