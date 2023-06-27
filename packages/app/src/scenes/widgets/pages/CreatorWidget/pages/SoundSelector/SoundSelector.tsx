import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Frame, MusicPlayerView} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {SoundFormInterface} from 'core/interfaces';

import {SoundFileForm} from './components';
import * as styled from './SoundSelector.styled';

const SoundSelector: FC = () => {
  const {widgetStore, universeStore, musicStore} = useStore();
  const {worldId} = universeStore;
  const {creatorStore} = widgetStore;
  const {soundSelectorStore} = creatorStore;
  const {soundList} = soundSelectorStore;

  const [isNewForm, setIsNewForm] = useState(false);

  const {t} = useI18n();

  useEffect(() => {
    soundSelectorStore.fetchSound(worldId);

    return () => {
      soundSelectorStore.resetModel();
    };
  }, [soundSelectorStore, worldId]);

  useEffect(() => {
    musicStore.setTracks(soundList);
  }, [musicStore, soundList, soundList.length]);

  const handlePublish = async (form: SoundFormInterface) => {
    if (await soundSelectorStore.publishSound(form, worldId)) {
      await soundSelectorStore.fetchSound(worldId);
      setIsNewForm(false);
    }
  };

  const handleDelete = async (hash: string) => {
    if (await soundSelectorStore.deleteSound(hash, worldId)) {
      await soundSelectorStore.fetchSound(worldId);
    }
  };

  return (
    <styled.Container data-testid="SoundSelector-test">
      <Frame>
        <styled.Head>
          <styled.Title>{t('titles.odysseySoundtrack')}</styled.Title>
          <styled.Message>{t('messages.odysseySoundtrack')}</styled.Message>

          <styled.UploadBlock>
            {!isNewForm ? (
              <Button
                wide
                icon="sound_add"
                label={t('actions.uploadSoundFile')}
                onClick={() => setIsNewForm(true)}
              />
            ) : (
              <SoundFileForm
                isPending={soundSelectorStore.isUpdating}
                onCancel={() => setIsNewForm(false)}
                onPublish={handlePublish}
              />
            )}
          </styled.UploadBlock>
        </styled.Head>
      </Frame>

      <styled.TracksContainer>
        <MusicPlayerView
          tracks={soundSelectorStore.soundList}
          activeTrack={musicStore.activeTrack}
          isPlaying={musicStore.isPlaying}
          durationSec={musicStore.durationSec}
          playedSec={musicStore.playedSec}
          volumePercent={musicStore.volume}
          onStart={(track) => musicStore.start(track.hash)}
          onPlay={musicStore.play}
          onPause={musicStore.pause}
          onStop={musicStore.stop}
          onChangeVolume={musicStore.setVolume}
          onChangePlayed={musicStore.setHowlerSeek}
          onDeleteTrack={handleDelete}
        />
      </styled.TracksContainer>
    </styled.Container>
  );
};

export default observer(SoundSelector);
