import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {IconSvg, Portal, Text} from 'ui-kit';
import {AgoraRemoteUserInterface} from 'core/models';

import * as styled from './UserMenu.styled';

interface PropsInterface {
  user: AgoraRemoteUserInterface;
  onMuteUser?: () => void;
  onKickUser?: () => void;
  coords: {left: number; top: number; width: number};
}

const UserMenu: FC<PropsInterface> = (props) => {
  const {user, onMuteUser, onKickUser, coords} = props;

  const {t} = useTranslation();

  return (
    <Portal>
      <styled.Container style={{...coords}}>
        <styled.Content>
          {!user.isMuted && (
            <styled.Option onClick={onMuteUser}>
              <styled.IconContainer>
                <IconSvg name="microphoneOff" />
              </styled.IconContainer>
              <Text
                text={t('actions.muteName', {name: user.name})}
                size="xxs"
                isMultiline={false}
              />
            </styled.Option>
          )}
          <styled.Option onClick={onKickUser}>
            <styled.IconContainer>
              <IconSvg name="remove-user" />
            </styled.IconContainer>
            <Text text={t('actions.kickName', {name: user.name})} size="xxs" isMultiline={false} />
          </styled.Option>
        </styled.Content>
        <styled.Triangle />
      </styled.Container>
    </Portal>
  );
};

export default UserMenu;
