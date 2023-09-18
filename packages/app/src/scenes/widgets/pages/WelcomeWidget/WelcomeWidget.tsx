import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import * as styled from './WelcomeWidget.styled';

const WelcomeWidget: FC = () => {
  const {widgetManagerStore, sessionStore, universeStore} = useStore();
  const {worldId} = universeStore;
  const {isGuest} = sessionStore;

  console.log(worldId, isGuest, widgetManagerStore);

  return (
    <styled.Container data-testid="WelcomeWidget-test">
      <styled.Hexagons>
        <styled.TopHexagons>
          <styled.BigHexagon className="hexagon">
            <span>I am</span>
          </styled.BigHexagon>
          <styled.BigHexagon className="hexagon">
            <span>I am</span>
          </styled.BigHexagon>
        </styled.TopHexagons>
        <styled.BottomHexagon>
          <styled.BigHexagon className="hexagon">
            <span>I am</span>
          </styled.BigHexagon>
        </styled.BottomHexagon>
      </styled.Hexagons>
    </styled.Container>
  );
};

export default observer(WelcomeWidget);
