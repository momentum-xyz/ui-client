import {FC} from 'react';

import {WidgetViewerPage, WidgetMenuPage} from './pages';
import * as styled from './WidgetManager.styled';

const WidgetManager: FC = () => {
  return (
    <styled.Container data-testid="WidgetManager-test">
      <WidgetViewerPage />
      <WidgetMenuPage />
    </styled.Container>
  );
};

export default WidgetManager;
