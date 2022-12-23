import React from 'react';

import astronaut from '../../images/astronaut.svg';
import {render} from '../../utils/test.utils';

import Image from './Image';

describe('Image', () => {
  const src = astronaut;

  test('renders', () => {
    const imageComponent = render(<Image src={src} />);
    expect(imageComponent.baseElement).not.toBeNull();
  });
  // test('shows image (no error or loading)', () => {
  //   const imageComponent = render(<Image src={src} />);
  //   expect(within(imageComponent.baseElement).queryAllByRole('img.image')).toHaveLength(1);
  // });
  // test('shows loading when `isLoading`', () => {
  //   const imageComponent = render(<Image src={src} isLoading />);
  //   expect(within(imageComponent.baseElement).queryAllByRole('img.image-loading')).toHaveLength(1);
  // });
  // test('shows error when `isError`', () => {
  //   const imageComponent = render(<Image src="some-broken-url" />);
  //   expect(within(imageComponent.baseElement).queryAllByRole('img.image-error')).toHaveLength(1);
  // });
  // test('shows error when the url is broken', () => {
  //   const imageComponent = render(<Image src="some-broken-url" />);
  //   expect(within(imageComponent.baseElement).queryAllByRole('img.image-error')).toHaveLength(1);
  // });
});
