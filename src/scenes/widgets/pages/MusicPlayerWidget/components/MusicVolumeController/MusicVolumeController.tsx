import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {SvgButton} from 'ui-kit';

import * as styled from './MusicVolumeController.styled';

export interface PropsInterface {}

const MusicVolumeController: FC<PropsInterface> = () => {
  const {musicPlayerStore} = useStore().widgetStore;
  const {musicPlayer} = musicPlayerStore;

  return (
    <styled.Container>
      <styled.Title>{t('musicPlayer.playerVolume')}</styled.Title>
      <styled.VolumeContainer>
        <SvgButton iconName="player-mute" size="medium" onClick={musicPlayer.unmute} />
        <styled.VolumeBarContainer>
          <styled.BarThumbPosition width={musicPlayer.volume * 100 + '%'} />
          <styled.VolumeBar
            type="range"
            min="0"
            max="1"
            step=".01"
            value={musicPlayer.volume}
            onChange={(e) => {
              if (musicPlayer.muted) {
                musicPlayer.toggleMute();
              }
              musicPlayer.setVolume(parseFloat(e.target.value));
            }}
          />
        </styled.VolumeBarContainer>
        <SvgButton iconName="player-unmute" size="medium" onClick={musicPlayer.mute} />
      </styled.VolumeContainer>
    </styled.Container>
  );
};

export default observer(MusicVolumeController);
