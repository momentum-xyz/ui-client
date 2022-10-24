import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';

import NetworkButton from './NetworkButton';

describe('NetworkButton', () => {
  test('is rendered', () => {
    const rendered = render(<NetworkButton label="" imageSrc="" onClick={() => {}} />);
    expect(within(rendered.baseElement).getByTestId('NetworkButton-test')).not.toBeNull();
  });
});

export {};
