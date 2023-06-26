import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Frame, SoundListPlayer} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {SoundFormInterface} from 'core/interfaces';

import {SoundFileForm} from './components';
import * as styled from './SoundSelector.styled';

const SoundSelector: FC = () => {
  const {widgetStore, universeStore} = useStore();
  const {worldId, musicStore} = universeStore;
  const {creatorStore} = widgetStore;
  const {soundSelectorStore} = creatorStore;

  const [isNewForm, setIsNewForm] = useState(false);

  const {t} = useI18n();

  useEffect(() => {
    soundSelectorStore.fetchSound(worldId);

    return () => {
      soundSelectorStore.resetModel();
    };
  }, [soundSelectorStore, worldId]);

  const handlePublish = async (form: SoundFormInterface) => {
    if (await soundSelectorStore.publishSound(form, worldId)) {
      await soundSelectorStore.fetchSound(worldId);
      setIsNewForm(false);
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
        {soundSelectorStore.soundInfos.length}
        <SoundListPlayer
          tracks={[]}
          volumePercent={musicStore.volume}
          onChangeVolume={musicStore.setVolume}
          onDeleteTrack={(hash) => console.log(hash)}
        />
      </styled.TracksContainer>
    </styled.Container>
  );
};

export default observer(SoundSelector);
