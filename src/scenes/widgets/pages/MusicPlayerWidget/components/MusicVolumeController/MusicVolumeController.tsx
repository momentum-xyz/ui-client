import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {SvgButton} from 'ui-kit';

import * as styled from './MusicVolumeController.styled';

export interface PropsInterface {}

const MusicVolumeController: FC<PropsInterface> = () => {
  const {musicPlayerStore} = useStore().widgetStore;
  const {volume, setVolume, handleUnmuteButton, handleMuteButton} = musicPlayerStore;

  return (
    <styled.Container>
      <styled.Title>Music Volume</styled.Title>
      <styled.VolumeContainer>
        <SvgButton iconName="player-mute" size="medium" onClick={handleMuteButton} />
        <styled.VolumeBarContainer width={100 + '%'}>
          <styled.BarThumbPosition width={volume * 100 + '%'} />
          <styled.VolumeBar
            type="range"
            min="0"
            max="1"
            step=".01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </styled.VolumeBarContainer>
        <SvgButton iconName="player-unmute" size="medium" onClick={handleUnmuteButton} />
      </styled.VolumeContainer>
    </styled.Container>
  );
};

export default observer(MusicVolumeController);
