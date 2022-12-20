import React from 'react';

import {render, within} from '../../utils/test.utils';

import Tooltip from './Tooltip';

describe('ToolTip', () => {
  test('is rendered as in top', () => {
    const renderedComponent = render(<Tooltip label="" placement="top" visible={true} />);

    expect(within(renderedComponent.baseElement).getByTestId('Tooltip-test')).not.toBeNull();
  });

  test("contains 'Text'", async () => {
    const rendered = render(<Tooltip label="Text" placement="bottom" visible={true} />);
    expect(await rendered.findByText('Text')).not.toBeNull();
  });
});

export {};
