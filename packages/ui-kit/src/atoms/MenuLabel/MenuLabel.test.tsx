import React from 'react';

import {render, within} from '../../utils/test.utils';

import MenuLabel from './MenuLabel';

describe('MenuLabel', () => {
  it('is rendered', () => {
    const rendered = render(<MenuLabel text="Lorem Ipsum" />);

    expect(within(rendered.baseElement).getByTestId('MenuLabel-test')).not.toBeNull();
  });
});

export {};
