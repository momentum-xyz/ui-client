import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {SoundPlayer, SoundRange} from '@momentum-xyz/ui-kit';

import {MusicPlayerModelType} from 'core/models';

import * as styled from './MusicPlayerView.styled';

interface PropsInterface {
  musicPlayer: MusicPlayerModelType;
  isVolumeSeekingEnabled?: boolean;
  setVolume: (volumePercent: number) => void;
  setDistancePercent?: (distancePercent: number) => void;
}

const MusicPlayerView: FC<PropsInterface> = (props) => {
  const {musicPlayer, isVolumeSeekingEnabled, setVolume, setDistancePercent} = props;
  const {activeTrack} = musicPlayer;

  const {t} = useI18n();

  return (
    <styled.Container data-testid="MusicPlayerView-test">
      <styled.ActiveTrack>
        {musicPlayer.isActiveTrackShown && (
          <styled.Block>
            <styled.Title>
              {!activeTrack ? t('messages.noSoundSelected') : activeTrack.name}
            </styled.Title>
            <SoundPlayer
              state={musicPlayer.activeTrackState}
              onIsPlaying={musicPlayer.isPlaying ? musicPlayer.pause : musicPlayer.play}
              onIsSeeking={musicPlayer.setIsSeeking}
              onChangePlayed={musicPlayer.setHowlerSeek}
            />
          </styled.Block>
        )}

        <styled.Block>
          <styled.Title>{t('labels.volume')}</styled.Title>
          <SoundRange
            percent={musicPlayer.volume}
            onChange={setVolume}
            onIsSeeking={isVolumeSeekingEnabled ? musicPlayer.setIsVolumeSeeking : undefined}
          />
        </styled.Block>

        {musicPlayer.isDistanceShown && (
          <styled.Block>
            <styled.Title>{t('labels.distance')}</styled.Title>
            <SoundRange
              leftIcon="distance_small"
              rightIcon="distance_large"
              percent={musicPlayer.distancePercent}
              onIsSeeking={musicPlayer.setIsDistanceSeeking}
              onChange={(percent) => setDistancePercent?.(percent)}
            />
          </styled.Block>
        )}
      </styled.ActiveTrack>
    </styled.Container>
  );
};

export default observer(MusicPlayerView);
