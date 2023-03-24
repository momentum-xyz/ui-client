import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Menu} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './LoginMenuPage.styled';

// TODO: TBD. Menu for a login flow
const LoginMenuPage: FC = () => {
  return (
    <styled.Container data-testid="LoginMenuPage-test">
      <Menu />
    </styled.Container>
  );
};

export default observer(LoginMenuPage);
