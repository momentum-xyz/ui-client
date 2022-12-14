import React from 'react';

import {render} from 'utils/test.utils';

import Image from './Image';

describe('Image', () => {
  test('renders', () => {
    const imageComponent = render(<Image src="..." />);

    expect(imageComponent.baseElement).not.toBeNull();
  });

  // test('shows image', () => {
  //   const imageComponent = render(
  //     <Avatar size="small" status={UserStatusEnum.ONLINE} avatarSrc="someUrl" />
  //   );

  //   expect(within(imageComponent.baseElement).queryAllByRole('img')).not.toHaveLength(0);
  // });

  // test('shows placeholder', () => {
  //   const imageComponent = render(<Avatar size="small" status={UserStatusEnum.ONLINE} />);

  //   expect(
  //     within(imageComponent.baseElement).queryAllByTestId('Avatar-placeholder-test')
  //   ).not.toHaveLength(0);
  // });
});
