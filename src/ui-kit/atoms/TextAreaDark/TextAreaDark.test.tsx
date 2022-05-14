import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';
import {TextAreaDark} from 'ui-kit/atoms';

describe('TextAreaDark', () => {
  test('is rendered', () => {
    const rendered = render(<TextAreaDark placeholder="Placeholder" />);
    expect(within(rendered.baseElement).getByTestId('TextArea-test')).not.toBeNull();
  });
});

export {};
