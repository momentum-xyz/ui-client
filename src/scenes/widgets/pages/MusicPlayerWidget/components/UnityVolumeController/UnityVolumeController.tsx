import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {SvgButton} from 'ui-kit';

import * as styled from './UnityVolumeController.styled';

const UnityVolumeController: FC = () => {
  const {unityStore} = useStore().mainStore;

  useEffect(() => {
    unityStore.setInitialVolume();
  }, []);

  return (
    <styled.Container data-testid="UnityVolumeController-test">
      <styled.Title>{t('musicPlayer.unityVolume')}</styled.Title>
      <styled.VolumeContainer>
        <SvgButton iconName="player-mute" size="medium" onClick={unityStore.mute} />
        <styled.VolumeBarContainer>
          <styled.BarThumbPosition width={unityStore.volume * 100 + '%'} />
          <styled.VolumeBar
            type="range"
            min="0"
            max="1"
            step=".01"
            value={unityStore.volume}
            onChange={unityStore.volumeChange}
          />
        </styled.VolumeBarContainer>
        <SvgButton iconName="player-unmute" size="medium" onClick={unityStore.unmute} />
      </styled.VolumeContainer>
    </styled.Container>
  );
};

export default observer(UnityVolumeController);
