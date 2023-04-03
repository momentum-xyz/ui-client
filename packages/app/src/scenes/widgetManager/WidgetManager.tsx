import {FC} from 'react';

import {WidgetViewerPage, WidgetMenuPage} from './pages';
import * as styled from './WidgetManager.styled';

interface PropsInterface {
  isWorld?: boolean;
}

const WidgetManager: FC<PropsInterface> = (props) => {
  return (
    <styled.Container data-testid="WidgetManager-test">
      <WidgetViewerPage />
      <WidgetMenuPage {...props} />
    </styled.Container>
  );
};

export default WidgetManager;
