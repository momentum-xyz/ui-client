import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';

import MagicLink from './MagicLink';

describe('MagicLink', () => {
  test('is rendered', () => {
    const rendered = render(<MagicLink icon="locate" />);
    expect(within(rendered.baseElement).getByTestId('MagicLink-test')).not.toBeNull();
  });
});

export {};
