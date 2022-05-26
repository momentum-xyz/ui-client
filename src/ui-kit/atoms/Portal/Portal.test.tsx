import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';

import Portal from './Portal';

describe('Button', () => {
  it('is rendered', () => {
    const rendered = render(<Portal />);

    expect(within(rendered.baseElement).getByTestId('Portal-test')).not.toBeNull();
  });

  it('is rendered with children', () => {
    const rendered = render(
      <Portal>
        <div data-testid="Portal-child" />
      </Portal>
    );

    expect(within(rendered.baseElement).getByTestId('Portal-child')).not.toBeNull();
  });
});

export {};
