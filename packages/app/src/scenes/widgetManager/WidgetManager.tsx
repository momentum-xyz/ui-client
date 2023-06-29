import {FC, memo} from 'react';

import {MusicPlayer} from 'scenes/widgets/components';

import {WidgetViewerPage, WidgetMenuPage} from './pages';
import * as styled from './WidgetManager.styled';

interface PropsInterface {
  isWorld?: boolean;
  isWelcomePage?: boolean;
}

const WidgetManager: FC<PropsInterface> = (props) => {
  return (
    <styled.Container data-testid="WidgetManager-test">
      {props.isWorld && <MusicPlayer />}
      <WidgetViewerPage />
      <WidgetMenuPage {...props} />
    </styled.Container>
  );
};

export default memo(WidgetManager);
