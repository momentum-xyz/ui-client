import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';

import Heading from './Heading';

describe('Heading', () => {
  test('is rendered', () => {
    const renderedComponent = render(<Heading type="h1" label="" />);

    expect(renderedComponent.baseElement).toBeInTheDocument();
  });

  test('is rendered as h1', () => {
    const renderedComponent = render(<Heading type="h1" label="" />);

    expect(within(renderedComponent.baseElement).queryAllByTestId('Heading-H1-test')).toHaveLength(
      1
    );
  });

  test('is rendered as h2', () => {
    const renderedComponent = render(<Heading type="h2" label="" />);

    expect(within(renderedComponent.baseElement).queryAllByTestId('Heading-H2-test')).toHaveLength(
      1
    );
  });

  test('is rendered as h3', () => {
    const renderedComponent = render(<Heading type="h3" label="" />);

    expect(within(renderedComponent.baseElement).queryAllByTestId('Heading-H3-test')).toHaveLength(
      1
    );
  });

  test('is rendered as h4', () => {
    const renderedComponent = render(<Heading type="h4" label="" />);

    expect(within(renderedComponent.baseElement).queryAllByTestId('Heading-H4-test')).toHaveLength(
      1
    );
  });

  test('is rendered as h5', () => {
    const renderedComponent = render(<Heading type="h5" label="" />);

    expect(within(renderedComponent.baseElement).queryAllByTestId('Heading-H5-test')).toHaveLength(
      1
    );
  });

  test("contains 'Text'", () => {
    const renderedComponent = render(<Heading type="h1" label="Text" />);

    expect(renderedComponent.getByText('Text')).toBeInTheDocument();
  });
});

export {};
