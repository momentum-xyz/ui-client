import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';

import {OdysseyInfo} from '../OdysseyInfo';

describe('OdysseyInfo', () => {
  test('is rendered', () => {
    const rendered = render(<OdysseyInfo odyssey={{} as any} avatar="..." />);
    expect(within(rendered.baseElement).getByTestId('OdysseyInfo-test')).not.toBeNull();
  });
});

export {};
