import React from 'react';

import {render, within} from 'utils/test.utils';

import {InputDark} from '../InputDark';

describe('InputDark', () => {
  test('is rendered', () => {
    const rendered = render(<InputDark placeholder="Placeholder" />);
    expect(within(rendered.baseElement).getByTestId('InputDark-test')).not.toBeNull();
  });
});

export {};
