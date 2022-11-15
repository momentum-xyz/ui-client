import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import background from 'static/images/dummy-universe-map.png';

import * as styled from './WorldExplorerPage.styled';
import {ExplorePanel} from './components';

const WorldExplorerPage: FC = () => {
  return (
    <styled.WorldExplorerPageContainer background={background}>
      <ExplorePanel />
    </styled.WorldExplorerPageContainer>
  );
};

export default observer(WorldExplorerPage);
