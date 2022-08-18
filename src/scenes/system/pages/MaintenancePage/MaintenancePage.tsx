import {FC} from 'react';

import {SystemWideError} from 'ui-kit';

const MaintenancePage: FC = () => {
  return <SystemWideError text="systemWideError.underMaintenance" />;
};

export default MaintenancePage;
