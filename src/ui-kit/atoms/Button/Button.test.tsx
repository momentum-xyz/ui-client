import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';

import Button from './Button';

describe('Button', () => {
  test('is rendered', () => {
    const rendered = render(<Button variant="primary" size="normal" label="Text" />);
    expect(within(rendered.baseElement).getByTestId('Button-test')).not.toBeNull();
  });

  test("contains 'Text'", () => {
    const rendered = render(<Button variant="primary" size="normal" label="Text" />);
    expect(rendered.getByText('Text')).not.toBeNull();
  });
});

export {};
