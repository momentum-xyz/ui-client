import React from 'react';

import {render, within} from '../../utils/test.utils';

import TextAreaDark from './TextAreaDark';

describe('TextAreaDark', () => {
  test('is rendered', () => {
    const rendered = render(<TextAreaDark placeholder="Placeholder" />);
    expect(within(rendered.baseElement).getByTestId('TextArea-test')).not.toBeNull();
  });
});

export {};
