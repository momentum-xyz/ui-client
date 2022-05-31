import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {SvgButton} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './PlayerController.styled';

export interface PropsInterface {}

const PlayerController: FC<PropsInterface> = () => {
  const {musicPlayerStore} = useStore().widgetStore;
  const {playing, handleToggle, handleNext, handlePrevious} = musicPlayerStore;

  return (
    <styled.Container>
      <styled.Div>
        <SvgButton iconName="player-backward" size="normal" onClick={handlePrevious} />
        {playing ? (
          <SvgButton iconName="player-pause" size="medium-large" onClick={handleToggle} />
        ) : (
          <SvgButton iconName="play-button" size="medium-large" onClick={handleToggle} />
        )}
        <SvgButton iconName="player-forward" size="normal" onClick={handleNext} />
      </styled.Div>
    </styled.Container>
  );
};

export default observer(PlayerController);
