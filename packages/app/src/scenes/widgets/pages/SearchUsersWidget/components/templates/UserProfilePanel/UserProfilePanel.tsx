import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, IconSvg, Text, PanelLayout} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {NftItemInterface} from 'stores/NftStore/models';
import {UserInterface} from 'api';

import * as styled from './UserProfilePanel.styled';

interface OdysseyItemInterface extends NftItemInterface {
  connections: number;
  docking: number;
  events: number;
}

interface PropsInterface {
  odyssey: OdysseyItemInterface | null;
  user?: UserInterface;
  userAvatar?: string;
  worldId?: string;
  nftId?: string;
  alreadyConnected: boolean;
  onTeleport: (worldId: string) => void;
  onHighFive: (userId: string) => void;
  onConnect?: () => void;
  onClose: () => void;
}

const UserProfilePanel: FC<PropsInterface> = (props) => {
  const {
    odyssey,
    nftId,
    alreadyConnected,
    onConnect,
    onTeleport,
    onHighFive,
    onClose,
    user,
    userAvatar,
    worldId
  } = props;
  const {t} = useTranslation();

  return (
    <PanelLayout
      title={odyssey?.name ?? user?.name}
      onClose={onClose}
      componentSize={{width: '315px'}}
      headerStyle="uppercase"
      showCloseButton
    >
      <styled.Container data-testid="UserProfilePanel-test">
        <styled.TopContainer>
          <styled.AvatarImage size="large" avatarSrc={userAvatar} />
          <styled.Actions>
            <Button
              size="small"
              label={t('labels.visit')}
              disabled={!nftId || odyssey?.uuid === worldId}
              onClick={() => onTeleport(odyssey?.uuid || '')}
              icon="fly-to"
            />
            <Button
              size="small"
              label={t('labels.highFive')}
              icon="high-five"
              onClick={() => onHighFive(odyssey?.uuid ?? '')}
            />
            <Button
              size="small"
              label={alreadyConnected ? t('labels.connected') : t('labels.connect')}
              icon="hierarchy"
              disabled={!nftId || odyssey?.uuid === worldId || alreadyConnected}
              onClick={onConnect}
            />
            <Button
              size="small"
              label={t('labels.coCreate')}
              icon="cubicles"
              onClick={() => {}}
              disabled={true}
            />
          </styled.Actions>
        </styled.TopContainer>
      </styled.Container>
      <styled.Description>
        <Text size="xxs" text={odyssey?.description} align="left" />
      </styled.Description>
      {odyssey && (
        <>
          <styled.Statistics>Statistics</styled.Statistics>

          <styled.StatisticsData>
            <styled.StatisticsItem>
              <IconSvg name="hierarchy" size="medium" />
              <styled.StatisticsValue>
                {odyssey?.connections ?? 0} connections
              </styled.StatisticsValue>
            </styled.StatisticsItem>
            <styled.StatisticsItem>
              <IconSvg name="people" size="medium" />
              <styled.StatisticsValue>{odyssey?.docking ?? 0} docking</styled.StatisticsValue>
            </styled.StatisticsItem>
            <styled.StatisticsItem>
              <IconSvg name="calendar" size="medium" />
              <styled.StatisticsValue>{odyssey?.events ?? 0} events</styled.StatisticsValue>
            </styled.StatisticsItem>
          </styled.StatisticsData>
        </>
      )}
    </PanelLayout>
  );
};

export default observer(UserProfilePanel);
