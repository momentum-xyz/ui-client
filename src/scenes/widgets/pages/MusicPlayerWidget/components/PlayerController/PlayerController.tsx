import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {SvgButton} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './PlayerController.styled';

const PlayerController: FC = () => {
  const {musicPlayerStore} = useStore().widgetStore;
  const {musicPlayer, togglePlayback, nextSong, previousSong} = musicPlayerStore;

  return (
    <styled.Container>
      <styled.Div>
        <SvgButton iconName="player-backward" size="normal" onClick={previousSong} />
        {musicPlayer.isPlaying ? (
          <SvgButton iconName="player-pause" size="medium-large" onClick={togglePlayback} />
        ) : (
          <SvgButton iconName="play-button" size="medium-large" onClick={togglePlayback} />
        )}
        <SvgButton iconName="player-forward" size="normal" onClick={nextSong} />
      </styled.Div>
    </styled.Container>
  );
};

export default observer(PlayerController);
