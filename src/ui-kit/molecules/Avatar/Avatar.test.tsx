import React from 'react';

import {render, within} from 'ui-kit/utils/test.utils';

import Avatar from './Avatar';

describe('Avatar', () => {
  test('renders', () => {
    const avatarComponent = render(<Avatar size="small" state="none" />);

    expect(avatarComponent.baseElement).not.toBeNull();
  });

  test('shows image', () => {
    const avatarComponent = render(<Avatar size="small" state="none" avatarSrc="someUrl" />);

    expect(within(avatarComponent.baseElement).queryAllByRole('img')).not.toHaveLength(0);
  });

  test('shows placeholder', () => {
    const avatarComponent = render(<Avatar size="small" state="none" />);

    expect(
      within(avatarComponent.baseElement).queryAllByTestId('Avatar-placeholder-test')
    ).not.toHaveLength(0);
  });
});
