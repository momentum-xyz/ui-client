import React from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {appVariables} from 'api/constants';
import {useStore} from 'shared/hooks';

import * as styled from './StageModeStats.styled';

const StageModeStats: React.FC = () => {
  const {t} = useTranslation();

  const {agoraStore_OLD} = useStore();
  const {agoraStageModeStore} = agoraStore_OLD;

  return (
    <styled.Container data-testid="StageModeStats-test">
      <span>
        {t('labels.speakers')}: {agoraStageModeStore.numberOfSpeakers}/
        {appVariables.MAX_STAGE_USERS}
      </span>
      <span>
        {t('labels.audience')}: {agoraStageModeStore.numberOfAudienceMembers}
      </span>
    </styled.Container>
  );
};

export default observer(StageModeStats);
