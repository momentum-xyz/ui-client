import React from 'react';
import {useTranslation} from 'react-i18next';

import {appVariables} from 'api/constants';

import * as styled from './StageModeStats.styled';

interface StageModeStatsPropsInterface {
  speakers: number;
  audience: number;
}

const StageModeStats: React.FC<StageModeStatsPropsInterface> = ({speakers, audience}) => {
  const {t} = useTranslation();

  return (
    <styled.Container>
      <span>
        {t('labels.speakers')}: {speakers}/{appVariables.MAX_STAGE_USERS}
      </span>
      <span>
        {t('labels.audience')}: {audience}
      </span>
    </styled.Container>
  );
};

export default StageModeStats;
