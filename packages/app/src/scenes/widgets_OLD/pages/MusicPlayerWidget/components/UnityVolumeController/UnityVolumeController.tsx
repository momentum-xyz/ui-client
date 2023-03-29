import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {SvgButton} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './UnityVolumeController.styled';

const UnityVolumeController: FC = () => {
  const {universeStore} = useStore();
  const {instance3DStore} = universeStore;

  const {t} = useI18n();

  return (
    <styled.Container data-testid="UnityVolumeController-test">
      <styled.Title>{t('musicPlayer.unityVolume')}</styled.Title>
      <styled.VolumeContainer>
        <SvgButton
          iconName="player-mute"
          size="medium"
          onClick={instance3DStore.mute}
          disabled={instance3DStore.volume === 0}
        />
        <styled.VolumeBarContainer>
          <styled.BarThumbPosition width={instance3DStore.volume * 100 + '%'} />
          <styled.VolumeBar
            type="range"
            min="0"
            max="1"
            step=".01"
            value={instance3DStore.volume}
            onChange={(e) => {
              instance3DStore.volumeChange(parseFloat(e.target.value));
            }}
          />
        </styled.VolumeBarContainer>
        <SvgButton
          iconName="player-unmute"
          size="medium"
          onClick={instance3DStore.unmute}
          disabled={instance3DStore.volume === 1}
        />
      </styled.VolumeContainer>
    </styled.Container>
  );
};

export default observer(UnityVolumeController);
