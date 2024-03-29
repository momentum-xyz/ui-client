import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Frame, SoundItem} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {SoundFormInterface} from 'core/interfaces';
import {MusicPlayerView} from 'scenes/widgets/components';
import {MusicFileForm} from 'ui-kit';

import * as styled from './MusicManager.styled';

const MusicManager: FC = () => {
  const {widgetStore, universeStore, musicStore} = useStore();
  const {worldId} = universeStore;
  const {creatorStore} = widgetStore;
  const {musicManagerStore} = creatorStore;

  const [isNewForm, setIsNewForm] = useState(false);

  const {t} = useI18n();

  const handlePublish = async (form: SoundFormInterface) => {
    if (await musicManagerStore.publishSound(form, worldId)) {
      setIsNewForm(false);
    }
  };

  const handleDelete = async (hash: string) => {
    await musicManagerStore.deleteSound(hash, worldId);
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
        <MusicPlayerView musicPlayer={musicStore.musicPlayer} setVolume={musicStore.setVolume} />

        {/* TRACK LIST */}
        <styled.TrackList>
          {musicStore.musicPlayer.trackList.map((track) => (
            <SoundItem
              key={track.hash}
              item={track}
              isActive={musicStore.musicPlayer.activeTrack?.hash === track.hash}
              onStart={() => musicStore.musicPlayer.start(track.hash)}
              onStop={musicStore.musicPlayer.stop}
              onDelete={() => handleDelete(track.hash)}
            />
          ))}
        </styled.TrackList>
      </styled.TracksContainer>
    </styled.Container>
  );
};

export default observer(MusicManager);
