import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Menu} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './OdysseyMenuPage.styled';

// TODO: TBD. Menu for an odyssey (Babylon)
const OdysseyMenuPage: FC = () => {
  return (
    <styled.Container data-testid="OdysseyMenuPage-test">
      <Menu />
    </styled.Container>
  );
};

export default observer(OdysseyMenuPage);
