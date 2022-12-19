import React from 'react';

import {render} from '../../utils/test.utils';

import Text from './Text';

describe('Text', () => {
  test('is rendered as XS', () => {
    const renderedComponent = render(<Text text="" size="xs" transform="normal" />);

    expect(renderedComponent.getByTestId('Text-test')).toHaveClass('xs');
  });

  test('is rendered as S', () => {
    const renderedComponent = render(<Text text="" size="s" transform="normal" />);

    expect(renderedComponent.getByTestId('Text-test')).toHaveClass('s');
  });

  test('is rendered as M', () => {
    const renderedComponent = render(<Text text="" size="m" transform="normal" />);

    expect(renderedComponent.getByTestId('Text-test')).toHaveClass('m');
  });

  test('is rendered as L', () => {
    const renderedComponent = render(<Text text="" size="l" transform="normal" />);

    expect(renderedComponent.getByTestId('Text-test')).toHaveClass('l');
  });

  test('is rendered as XL', () => {
    const renderedComponent = render(<Text text="" size="xl" transform="normal" />);

    expect(renderedComponent.getByTestId('Text-test')).toHaveClass('xl');
  });

  test('is rendered as Normal', () => {
    const renderedComponent = render(<Text text="" size="s" transform="normal" />);

    expect(renderedComponent.getByTestId('Text-test')).toHaveClass('transform-normal');
  });

  test('is rendered as LowerCase', () => {
    const renderedComponent = render(<Text text="" size="s" transform="lowercase" />);

    expect(renderedComponent.getByTestId('Text-test')).toHaveClass('transform-lowercase');
  });

  test('is rendered as UpperCase', () => {
    const renderedComponent = render(<Text text="" size="s" transform="uppercase" />);

    expect(renderedComponent.getByTestId('Text-test')).toHaveClass('transform-uppercase');
  });

  test('is rendered as single-lined', () => {
    const renderedComponent = render(
      <Text text="" size="s" transform="uppercase" isMultiline={false} />
    );

    expect(renderedComponent.getByTestId('Text-test')).toHaveClass('singleLine');
  });

  test('is rendered as multi-lined', () => {
    const renderedComponent = render(<Text text="" size="s" transform="uppercase" />);

    expect(renderedComponent.getByTestId('Text-test')).not.toHaveClass('singleLine');
  });

  test("contains 'Text'", () => {
    const renderedComponent = render(<Text text="Text" size="s" transform="normal" />);

    expect(renderedComponent.getByText('Text')).not.toBeNull();
  });
});

export {};
