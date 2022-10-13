import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {SvgButton} from '@momentum/ui-kit';

import {useStore} from 'shared/hooks';

import * as styled from './MusicVolumeController.styled';

const MusicVolumeController: FC = () => {
  const {musicPlayerStore} = useStore().widgetStore;
  const {musicPlayer} = musicPlayerStore;

  return (
    <styled.Container data-testid="MusicVolumeController-test">
      <styled.Title>{t('musicPlayer.playerVolume')}</styled.Title>
      <styled.VolumeContainer>
        <SvgButton
          iconName="player-mute"
          size="medium"
          onClick={musicPlayer.unmute}
          disabled={musicPlayer.volume === 0}
        />
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
        <SvgButton
          iconName="player-unmute"
          size="medium"
          onClick={musicPlayer.mute}
          disabled={musicPlayer.volume === 1}
        />
      </styled.VolumeContainer>
    </styled.Container>
  );
};

export default observer(MusicVolumeController);
