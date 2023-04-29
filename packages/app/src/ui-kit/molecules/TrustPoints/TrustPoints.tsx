import {FC} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {ProfileLine} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './TrustPoints.styled';

const COUNT = 59589588;

const TrustPoints: FC = () => {
  const {t} = useI18n();

  return (
    <styled.ExtraInfoPoints>
      <ProfileLine icon="visible" label={t('login.permissionInfo')} />
      <ProfileLine icon="locked" label={t('login.auditInfo')} />
      <ProfileLine icon="star_favorite" label={t('login.trustInfo', {count: COUNT})} />
    </styled.ExtraInfoPoints>
  );
};

export default TrustPoints;
