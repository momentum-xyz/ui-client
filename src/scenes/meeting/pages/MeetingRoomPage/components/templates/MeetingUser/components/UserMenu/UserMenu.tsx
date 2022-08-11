import React, {FC, useRef} from 'react';
import {useTranslation} from 'react-i18next';

import {IconSvg, Text, useClickOutside} from 'ui-kit';
import {AgoraRemoteUserInterface} from 'core/models';

import * as styled from './UserMenu.styled';

interface PropsInterface {
  user: AgoraRemoteUserInterface;
  onMuteUser?: () => void;
  onKickUser?: () => void;
  onClose?: () => void;
}

const UserMenu: FC<PropsInterface> = (props) => {
  const {user, onMuteUser, onKickUser, onClose} = props;

  const ref = useRef(null);
  const {t} = useTranslation();

  useClickOutside(ref, () => {
    onClose?.();
  });

  return (
    <styled.Container ref={ref}>
      <styled.Content>
        {!user.isMuted && (
          <styled.Option onClick={onMuteUser}>
            <styled.IconContainer>
              <IconSvg name="microphoneOff" />
            </styled.IconContainer>
            <Text text={t('actions.muteName', {name: user.name})} size="xxs" />
          </styled.Option>
        )}
        <styled.Option onClick={onKickUser}>
          <styled.IconContainer>
            <IconSvg name="remove-user" />
          </styled.IconContainer>
          <Text text={t('actions.kickName', {name: user.name})} size="xxs" />
        </styled.Option>
      </styled.Content>
      <styled.Triangle />
    </styled.Container>
  );
};

export default UserMenu;
