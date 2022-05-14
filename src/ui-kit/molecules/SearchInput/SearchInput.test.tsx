import React from 'react';

import {render} from 'ui-kit/utils/test.utils';

import SearchInput from './SearchInput';

describe('SearchInput', () => {
  it('renders', () => {
    const renderedSearchInput = render(<SearchInput onChange={() => {}} />);

    expect(renderedSearchInput.baseElement).toBeInTheDocument();
  });
});
