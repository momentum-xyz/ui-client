import React from 'react';

import {render, within} from 'utils/test.utils';

import {Location} from '../Location';

describe('Location', () => {
  test('is rendered', () => {
    const rendered = render(<Location icon="locate" />);
    expect(within(rendered.baseElement).getByTestId('Location-test')).not.toBeNull();
  });
});

export {};
