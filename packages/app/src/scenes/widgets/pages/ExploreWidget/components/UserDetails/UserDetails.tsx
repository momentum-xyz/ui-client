import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Image, Panel} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './UserDetails.styled';

interface PropsInterface {
  userId: string;
  onClose: () => void;
}

const UserDetails: FC<PropsInterface> = ({userId, onClose}) => {
  const {t} = useI18n();

  useEffect(() => {}, []);

  return (
    <styled.Container data-testid="UserDetails-test">
      <Panel icon="explore" variant="primary" title={t('labels.memberProfile')} onClose={onClose}>
        <styled.Wrapper>
          <Image errorIcon="astronaut" />
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(UserDetails);
