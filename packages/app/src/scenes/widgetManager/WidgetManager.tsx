import {FC} from 'react';

import {WidgetListPage, WidgetMenuPage} from './pages';
import * as styled from './WidgetManager.styled';

const WidgetManager: FC = () => {
  return (
    <styled.Container data-testid="WidgetManager-test">
      <WidgetListPage />
      <WidgetMenuPage />
    </styled.Container>
  );
};

export default WidgetManager;
