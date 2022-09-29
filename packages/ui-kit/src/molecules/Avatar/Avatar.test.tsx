import React from 'react';

import {render, within} from 'utils/test.utils';

import {UserStatusEnum} from '../../enums';

import Avatar from './Avatar';

describe('Avatar', () => {
  test('renders', () => {
    const avatarComponent = render(<Avatar size="small" status={UserStatusEnum.ONLINE} />);

    expect(avatarComponent.baseElement).not.toBeNull();
  });

  test('shows image', () => {
    const avatarComponent = render(
      <Avatar size="small" status={UserStatusEnum.ONLINE} avatarSrc="someUrl" />
    );

    expect(within(avatarComponent.baseElement).queryAllByRole('img')).not.toHaveLength(0);
  });

  test('shows placeholder', () => {
    const avatarComponent = render(<Avatar size="small" status={UserStatusEnum.ONLINE} />);

    expect(
      within(avatarComponent.baseElement).queryAllByTestId('Avatar-placeholder-test')
    ).not.toHaveLength(0);
  });
});
