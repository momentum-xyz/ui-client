import React, {FC, useRef} from 'react';
import {useTranslation} from 'react-i18next';

import {IconSvg, Text, useClickOutside} from 'ui-kit';

import * as styled from './ParticipantMenu.styled';

interface PropsInterface {
  name: string;
  uid: string | number;
  onClose?: (event?: Event) => void;
  removeParticipant?: () => void;
}

// TODO: Implement methods for muting and kicking in the CommunicationLayerStore and call them for each Option
const ParticipantMenu: FC<PropsInterface> = ({name, removeParticipant, onClose}) => {
  const {t} = useTranslation();
  const ref = useRef(null);

  useClickOutside(ref, () => {
    const event = new Event('backgroundClick');
    onClose?.(event);
  });

  return (
    <styled.Container ref={ref}>
      <styled.Content>
        <styled.Option>
          <styled.IconContainer>
            <IconSvg name="microphoneOff" />
          </styled.IconContainer>
          <Text text={t('actions.muteName', {name})} size="xxs" />
        </styled.Option>
        <styled.Option onClick={removeParticipant}>
          <styled.IconContainer>
            <IconSvg name="remove-user" />
          </styled.IconContainer>
          <Text text={t('actions.kickName', {name})} size="xxs" />
        </styled.Option>
      </styled.Content>
      <styled.Triangle />
    </styled.Container>
  );
};

export default ParticipantMenu;
