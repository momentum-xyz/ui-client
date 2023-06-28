import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Frame, SoundItem} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {SoundFormInterface} from 'core/interfaces';
import {MusicPlayerView} from 'scenes/widgets/components';

import {MusicFileForm} from './components';
import * as styled from './MusicManager.styled';

const MusicManager: FC = () => {
  const {widgetStore, universeStore, musicStore} = useStore();
  const {worldId} = universeStore;
  const {creatorStore} = widgetStore;
  const {musicManagerStore} = creatorStore;
  const {soundList} = musicManagerStore;

  const [isNewForm, setIsNewForm] = useState(false);

  const {t} = useI18n();

  useEffect(() => {
    musicManagerStore.fetchSound(worldId);

    return () => {
      musicManagerStore.resetModel();
    };
  }, [musicManagerStore, worldId]);

  useEffect(() => {
    musicStore.setTracks(soundList);
  }, [musicStore, soundList, soundList.length]);

  const handlePublish = async (form: SoundFormInterface) => {
    if (await musicManagerStore.publishSound(form, worldId)) {
      await musicManagerStore.fetchSound(worldId);
      setIsNewForm(false);
    }
  };

  const handleDelete = async (hash: string) => {
    if (await musicManagerStore.deleteSound(hash, worldId)) {
      await musicManagerStore.fetchSound(worldId);
    }
  };

  return (
    <styled.Container data-testid="MusicManager-test">
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
              <MusicFileForm
                isPending={musicManagerStore.isUpdating}
                onCancel={() => setIsNewForm(false)}
                onPublish={handlePublish}
              />
            )}
          </styled.UploadBlock>
        </styled.Head>
      </Frame>

      <styled.TracksContainer>
        {/* ACTIVE TRACK */}
        <MusicPlayerView />

        {/* TRACK LIST */}
        <styled.TrackList>
          {soundList.map((track) => (
            <SoundItem
              key={track.hash}
              item={track}
              isActive={musicStore.activeTrack?.hash === track.hash}
              onStart={() => musicStore.start(track.hash)}
              onStop={musicStore.stop}
              onDelete={() => handleDelete(track.hash)}
            />
          ))}
        </styled.TrackList>
      </styled.TracksContainer>
    </styled.Container>
  );
};

export default observer(MusicManager);
