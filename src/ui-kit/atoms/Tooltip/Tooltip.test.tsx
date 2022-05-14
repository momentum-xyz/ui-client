import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';

import Tooltip from './Tooltip';

describe('ToolTip', () => {
  test('is rendered as in top', () => {
    const renderedComponent = render(<Tooltip label="" placement="top" visible={true} />);

    expect(within(renderedComponent.baseElement).queryAllByTestId('Tooltip-test')).not.toBeNull();
  });

  test("contains 'Text'", () => {
    const rendered = render(<Tooltip label="Text" placement="bottom" visible={true} />);
    expect(rendered.findByText('Text')).not.toBeNull();
  });
});

export {};
