import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';

import IconSvg from './IconSvg';

describe('IconSvg', () => {
  it('is rendered', () => {
    const rendered = render(<IconSvg name="close" />);

    expect(within(rendered.baseElement).getByTestId('IconSvg-test')).not.toBeNull();
  });
});

export {};
