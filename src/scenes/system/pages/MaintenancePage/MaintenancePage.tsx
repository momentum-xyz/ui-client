import {FC} from 'react';
import {useTheme} from 'styled-components';

import {SystemWideError} from 'ui-kit';

const MaintenancePage: FC = () => {
  const theme = useTheme();
  return (
    <SystemWideError text="systemWideError.underMaintenance" showRefreshButton theme={theme} />
  );
};

export default MaintenancePage;
