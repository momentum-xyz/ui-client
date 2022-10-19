import React, {FC, memo} from 'react';
import {Avatar, Button, IconSvg, Text, UserStatusEnum} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import * as styled from './FlightPilot.styled';

interface PropsInterface {
  pilotName: string;
  pilotStatus: UserStatusEnum | null;
  pilotAvatarSrc?: string;
  onCloseOrDisengage: () => void;
}

const FlightPilot: FC<PropsInterface> = (props) => {
  const {pilotName, pilotStatus, pilotAvatarSrc, onCloseOrDisengage} = props;

  const {t} = useTranslation();

  return (
    <styled.Content>
      <IconSvg name="fly-with-me" size="normal-large" />
      <styled.UserContainer>
        <Text
          size="xs"
          text={t('messages.flyWithMeEnabled')}
          weight="bold"
          transform="uppercase"
          isMultiline={false}
        />
        <styled.User>
          <Avatar size="extra-small" status={pilotStatus} avatarSrc={pilotAvatarSrc} showHover />
          <styled.PilotLabel>
            <Text size="xs" text={t('labels.pilot')} transform="uppercase" weight="bold" />
            <Text size="xs" text=":" transform="uppercase" weight="bold" />
          </styled.PilotLabel>
          <styled.Pilot>
            <Text size="s" text={pilotName} align="left" isMultiline={false} />
          </styled.Pilot>
        </styled.User>
      </styled.UserContainer>
      <Button
        variant="danger-background"
        transform="normal"
        label={t('actions.disengageReturn')}
        onClick={onCloseOrDisengage}
      />
    </styled.Content>
  );
};

export default memo(FlightPilot);
