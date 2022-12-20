import React from 'react';

import {render} from '../../utils/test.utils';

import SvgButton from './SvgButton';

describe('SvgButton', () => {
  it('renders', () => {
    const renderedButton = render(<SvgButton iconName="close" size="small" onClick={() => {}} />);

    expect(renderedButton.baseElement).not.toBeNull();
  });
});

export {};
