import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';
import {InputDark} from 'ui-kit/atoms';

describe('InputDark', () => {
  test('is rendered', () => {
    const rendered = render(<InputDark placeholder="Placeholder" />);
    expect(within(rendered.baseElement).getByTestId('InputDark-test')).not.toBeNull();
  });
});

export {};
