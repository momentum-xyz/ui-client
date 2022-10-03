import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Text} from '@momentum/ui-kit';

import * as styled from './PeopleCount.styled';

interface PropsInterface {
  count: number;
}

const PeopleCount: FC<PropsInterface> = ({count}) => {
  const {t} = useTranslation();

  return (
    <styled.Container data-testid="PeopleCount-test">
      <Text text={t('counts.people', {count})} transform="uppercase" size="s" />
    </styled.Container>
  );
};

export default observer(PeopleCount);
