import React from 'react';

import {render, within} from '../../utils/test.utils';

import Hexagon from './Hexagon';

describe('Hexagon', () => {
  it('is rendered', () => {
    const rendered = render(<Hexagon type="primary" />);

    expect(within(rendered.baseElement).getByTestId('Hexagon-test')).not.toBeNull();
  });
});

export {};
