import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {IconSvg, Text} from 'ui-kit';

import * as styled from './ParticipantMenu.styled';

interface PropsInterface {
  name: string;
  uid: string | number;
}

// TODO: Implement methods for muting and kicking in the CommunicationLayerStore and call them for each Option
const ParticipantMenu: FC<PropsInterface> = ({name}) => {
  const {t} = useTranslation();

  return (
    <styled.Container>
      <styled.Content>
        <styled.Option>
          <styled.IconContainer>
            <IconSvg name="microphoneOff" />
          </styled.IconContainer>
          <Text text={t('actions.muteName', {name})} size="xxs" />
        </styled.Option>
        <styled.Option>
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
