import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Image, Panel} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './WorldDetails.styled';

interface PropsInterface {
  worldId: string;
  onClose: () => void;
}

const WorldDetails: FC<PropsInterface> = ({worldId, onClose}) => {
  const {t} = useI18n();

  useEffect(() => {}, []);

  return (
    <styled.Container data-testid="WorldDetails-test">
      <Panel icon="explore" variant="primary" title={t('labels.odysseyOverview')} onClose={onClose}>
        <styled.Wrapper>
          <Image errorIcon="rabbit_fill" />
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(WorldDetails);
