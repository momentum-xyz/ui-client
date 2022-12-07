import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, IconSvg, Text, PanelLayout} from '@momentum-xyz/ui-kit';

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
  onTeleport: (worldId: string) => void;
  onConnect?: () => void;
  onClose: () => void;
}

const UserProfilePanel: FC<PropsInterface> = (props) => {
  const {odyssey, nftId, onConnect, onTeleport, onClose, user, userAvatar, worldId} = props;

  return (
    <PanelLayout
      title={odyssey?.name ?? user?.name ?? 'User Name'}
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
              label="Visit"
              disabled={!nftId || odyssey?.uuid === worldId}
              onClick={() => onTeleport(user?.id || '')}
              icon="fly-to"
            />
            <Button size="small" label="High Five" icon="high-five" onClick={() => {}} />
            <Button
              size="small"
              label="Connect"
              icon="hierarchy"
              disabled={!nftId || odyssey?.uuid === worldId}
              onClick={onConnect}
            />
            <Button
              size="small"
              label="co-create"
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
