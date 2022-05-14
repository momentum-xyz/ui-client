import {Input} from './index';

import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';

describe('Input', () => {
  test('is rendered', () => {
    const rendered = render(<Input label="Label" placeholder="Placeholder" />);
    expect(within(rendered.baseElement).getByTestId('Label-test')).not.toBeNull();
  });

  test("contains 'Label'", () => {
    const rendered = render(<Input label="Label" placeholder="Placeholder" />);
    expect(rendered.getByText('Label')).not.toBeNull();
  });
});

export {};
