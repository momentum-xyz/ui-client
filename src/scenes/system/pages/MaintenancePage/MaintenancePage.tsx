import {FC} from 'react';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';

import {SystemWideError} from 'ui-kit';

const MaintenancePage: FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  return (
    <SystemWideError text={t('systemWideError.underMaintenance')} showRefreshButton theme={theme} />
  );
};

export default MaintenancePage;
