import React from 'react';

import {render} from 'ui-kit/utils/test.utils';

import TextArea from './TextArea';

describe('TextArea', () => {
  it('is rendered', () => {
    const renderedTextArea = render(<TextArea name="name" />);

    expect(renderedTextArea.baseElement).toBeInTheDocument();
  });
});
