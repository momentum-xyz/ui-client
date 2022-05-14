import {render, within} from 'ui-kit/utils/test.utils';
import TextArea from './TextArea';
import React from 'react';

describe('TextArea', () => {
  it('is rendered', () => {
    const renderedTextArea = render(<TextArea name="name" />);

    expect(renderedTextArea.baseElement).toBeInTheDocument();
  });
});
