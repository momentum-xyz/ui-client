import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Hexagon} from '@momentum-xyz/ui-kit';

import {CanvasConfigInterface} from 'api/interfaces';

import * as styled from './MissionInfo.styled';

interface PropsInterface {
  config: CanvasConfigInterface;
}

const MissionInfo: FC<PropsInterface> = ({config}) => {
  return (
    <styled.Container data-testid="MissionInfo-test">
      <styled.Header>
        <Hexagon type="fourth-borderless" iconName="rocket" />
        <span>{config.missionTitle}</span>
      </styled.Header>

      <div>{config.missionStory}</div>
    </styled.Container>
  );
};

export default observer(MissionInfo);
