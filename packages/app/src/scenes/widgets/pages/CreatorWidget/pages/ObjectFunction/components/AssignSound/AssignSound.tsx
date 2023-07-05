import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button, Frame, SoundItem} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {MusicFileForm} from 'ui-kit';
import {SoundFormInterface} from 'core/interfaces';
import {MusicPlayerView} from 'scenes/widgets/components';

import * as styled from './AssignSound.styled';

interface PropsInterface {
  objectId: string;
}

const AssignSound: FC<PropsInterface> = ({objectId}) => {
  const {musicStore, widgetStore} = useStore();
  const {creatorStore} = widgetStore;
  const {objectFunctionalityStore} = creatorStore;
  const {objectSound} = objectFunctionalityStore;
  const {musicPlayer} = objectSound;

  const [isNewForm, setIsNewForm] = useState(false);

  const {t} = useI18n();

  useEffect(() => {
    const isWorldMusicPlaying = musicStore.musicPlayer.isPlaying;
    musicStore.musicPlayer.pause();

    return () => {
      if (isWorldMusicPlaying) {
        musicStore.musicPlayer.play();
      }
    };
  }, [musicStore.musicPlayer]);

  useEffect(() => {
    objectSound.init(objectId);
    objectSound.subscribe();

    return () => {
      objectSound.unsubscribe();
      objectSound.resetModel();
    };
  }, [objectId, objectSound]);

  const handlePublish = async (form: SoundFormInterface) => {
    if (await objectSound.publishSpacialSound(form)) {
      setIsNewForm(false);
    }
  };

  const handleDelete = async (hash: string) => {
    await objectSound.deleteSpacialSound(hash);
  };

  const handleStart = async (hash: string) => {
    await objectSound.updateActiveTrack(hash);
  };

  const handleStop = async () => {
    await objectSound.updateActiveTrack(null);
  };

  return (
    <styled.Container data-testid="AssignSound-test">
      <Frame>
        <styled.Head>
          <styled.Title>{t('titles.objectSound')}</styled.Title>
          <styled.Message>{t('messages.objectSound')}</styled.Message>

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
                isPending={objectSound.isUpdating}
                onCancel={() => setIsNewForm(false)}
                onPublish={handlePublish}
              />
            )}
          </styled.UploadBlock>
        </styled.Head>
      </Frame>

      <styled.TracksContainer>
        {/* ACTIVE TRACK. FYI: It will be played by Babylon */}
        <MusicPlayerView
          musicPlayer={musicPlayer}
          setVolume={objectSound.updateVolume}
          setDistancePercent={objectSound.updateDistance}
        />

        {/* TRACK LIST */}
        <styled.TrackList>
          {musicPlayer.trackList.map((track) => (
            <SoundItem
              key={track.hash}
              item={track}
              isActive={musicPlayer.activeTrack?.hash === track.hash}
              onStart={() => handleStart(track.hash)}
              onStop={handleStop}
              onDelete={() => handleDelete(track.hash)}
            />
          ))}
        </styled.TrackList>
      </styled.TracksContainer>
    </styled.Container>
  );
};

export default observer(AssignSound);
