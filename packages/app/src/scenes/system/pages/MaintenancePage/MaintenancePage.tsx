import {FC} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {SystemWideError} from '@momentum-xyz/ui-kit-storybook';

const MaintenancePage: FC = () => {
  const {t} = useI18n();
  return <SystemWideError text={t('systemMessages.underMaintenance')} showRefreshButton />;
};

export default MaintenancePage;
