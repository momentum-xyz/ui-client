import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {
  Heading,
  IconSvg,
  ScreenSectionsEnum,
  SectionedScreenPortal,
  SvgButton
} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import {VoiceChatPanel} from './components';
import * as styled from './VoiceChatWidget.styled';

const VoiceChatWidget: FC = () => {
  const {widgetsStore, agoraStore, sessionStore, unityStore} = useStore();
  const {voiceChatStore} = widgetsStore;
  const {agoraVoiceChatStore} = agoraStore;

  const {t} = useTranslation();

  useEffect(() => {
    agoraStore.init(unityStore.worldId, sessionStore.userId);
  }, [agoraStore, unityStore.worldId, sessionStore]);

  const handleClose = useCallback(async () => {
    if (agoraVoiceChatStore.hasJoined) {
      await agoraStore.leaveVoiceChat();
    }

    voiceChatStore.dialog.close();
  }, [agoraStore, agoraVoiceChatStore.hasJoined, voiceChatStore.dialog]);

  return (
    <SectionedScreenPortal section={ScreenSectionsEnum.TOP_RIGHT}>
      <styled.Container>
        <styled.Header>
          <styled.HeaderItemsGroup>
            <IconSvg name="microphoneOn" size="medium" />
            <Heading label={t('labels.voiceChat')} transform="uppercase" type="h2" />
          </styled.HeaderItemsGroup>
          <styled.HeaderItemsGroup>
            <SvgButton iconName="close" size="medium" onClick={handleClose} />
          </styled.HeaderItemsGroup>
        </styled.Header>
        <styled.Body>
          <VoiceChatPanel />
        </styled.Body>
      </styled.Container>
    </SectionedScreenPortal>
  );
};

export default observer(VoiceChatWidget);
