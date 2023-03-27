import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Menu, MenuItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {MenuItemType} from 'core/types';

import * as styled from './LoginMenuPage.styled';

// TODO: TBD. Menu for a login flow
const LoginMenuPage: FC = () => {
  const CENTER_ITEMS: MenuItemInterface<MenuItemType>[] = [{key: 'UNIVERSE', iconName: 'info_2'}];

  return (
    <styled.Container data-testid="LoginMenuPage-test">
      <Menu centerItems={CENTER_ITEMS} />
    </styled.Container>
  );
};

export default observer(LoginMenuPage);
