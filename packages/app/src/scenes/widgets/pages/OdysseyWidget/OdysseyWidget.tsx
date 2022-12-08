import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, IconSvg, Text, Dialog} from '@momentum-xyz/ui-kit';

import {OdysseyItemInterface} from '../../stores/OdysseyStore';

import * as styled from './OdysseyWidget.styled';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

interface PropsInterface {
  odyssey: OdysseyItemInterface | null;
  userAvatar?: string;
  nftId?: string;
  onConnect?: () => void;
  onClose?: () => void;
}

const OdysseyWidget: FC<PropsInterface> = (props) => {
  const {odyssey, userAvatar, nftId, onConnect, onClose} = props;

  if (!odyssey) {
    return null;
  }
  return (
    <Dialog
      position="leftTop"
      title={odyssey.name}
      offset={{left: MENU_OFFSET_LEFT, top: MENU_OFFSET_TOP}}
      showBackground={false}
      headerStyle="uppercase"
      layoutSize={{width: '315px'}}
      onClose={onClose}
      showCloseButton
    >
      <styled.Container data-testid="SelectedOdyssey-test">
        <styled.TopContainer>
          <styled.Avatar src={userAvatar} />
          <styled.Actions>
            <Button size="small" label="Visit" disabled={!!nftId} icon="fly-to" />
            <Button size="small" label="High Five" icon="high-five" onClick={() => {}} />
            <Button
              size="small"
              label="Connect"
              icon="hierarchy"
              disabled={!onConnect}
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
        <Text size="xxs" text={odyssey.description} align="left" />
      </styled.Description>

      <styled.Statistics>Statistics</styled.Statistics>

      <styled.StatisticsData>
        <styled.StatisticsItem>
          <IconSvg name="hierarchy" size="medium" />
          <styled.StatisticsValue>{odyssey.connections ?? 0} connections</styled.StatisticsValue>
        </styled.StatisticsItem>
        <styled.StatisticsItem>
          <IconSvg name="people" size="medium" />
          <styled.StatisticsValue>{odyssey.docking ?? 0} docking</styled.StatisticsValue>
        </styled.StatisticsItem>
        <styled.StatisticsItem>
          <IconSvg name="calendar" size="medium" />
          <styled.StatisticsValue>{odyssey.events ?? 0} events</styled.StatisticsValue>
        </styled.StatisticsItem>
      </styled.StatisticsData>
    </Dialog>
  );
};

export default observer(OdysseyWidget);
