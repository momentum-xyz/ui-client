import {CoordinationInterface, IconSvg, Portal, useClickOutside} from '@momentum-xyz/ui-kit';
import {FC, useRef} from 'react';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './VoiceChatUserActions.styled';

interface PropsInterface {
  name: string;
  coords?: CoordinationInterface;
  onUserMute?: () => void;
  onUserKick?: () => void;
  onClose: () => void;
}

const VoiceChatUserActions: FC<PropsInterface> = ({
  name,
  coords,
  onUserMute,
  onUserKick,
  onClose
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const {t} = useI18n();

  useClickOutside(ref, () => {
    onClose();
  });

  return (
    <Portal>
      <styled.Container ref={ref} style={{...coords}}>
        <styled.Menu>
          <styled.Body>
            <styled.Action onClick={onUserMute}>
              <IconSvg name="microphoneOff" />
              <styled.ActionLabel
                text={t('actions.muteName', {name})}
                weight="light"
                size="xxs"
                align="left"
              />
            </styled.Action>
            <styled.Action onClick={onUserKick}>
              <IconSvg name="remove-user" />
              <styled.ActionLabel
                text={t('actions.kickNameFromVoice', {name})}
                weight="light"
                size="xxs"
                align="left"
              />
            </styled.Action>
          </styled.Body>
          <styled.Pointer />
        </styled.Menu>
      </styled.Container>
    </Portal>
  );
};

export default VoiceChatUserActions;
