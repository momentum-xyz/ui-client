import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {SoundPlayer, SoundVolume} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import * as styled from './MusicPlayerView.styled';

const MusicPlayerView: FC = () => {
  const {musicStore} = useStore();
  const {activeTrack, musicPlayer} = musicStore;

  const {t} = useI18n();

  return (
    <styled.Container data-testid="MusicPlayerView-test">
      <styled.ActiveTrack>
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

        <styled.Block>
          <styled.Title>{t('labels.volume')}</styled.Title>
          <SoundVolume volumePercent={musicPlayer.volume} onChangeVolume={musicStore.setVolume} />
        </styled.Block>
      </styled.ActiveTrack>
    </styled.Container>
  );
};

export default observer(MusicPlayerView);
