import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';

import {OdysseyInfo} from 'ui-kit/molecules/OdysseyInfo';

import {OdysseyItemInterface} from '../../stores/OdysseyStore';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

interface PropsInterface {
  currentUserId: string;
  odyssey: OdysseyItemInterface | null;
  userAvatar?: string;
  nftId?: string;
  alreadyConnected: boolean;
  onConnect?: () => void;
  onHighFive: (userId: string) => void;
  onClose?: () => void;
}

const OdysseyWidget: FC<PropsInterface> = ({
  odyssey,
  userAvatar,
  nftId,
  currentUserId,
  alreadyConnected,
  onConnect,
  onHighFive,
  onClose
}) => {
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
      <OdysseyInfo
        odyssey={odyssey}
        alreadyConnected={alreadyConnected}
        onVisit={() => {}}
        visitDisabled={true}
        onHighFive={() => {
          onHighFive(odyssey.uuid);
        }}
        highFiveDisabled={currentUserId === odyssey.uuid}
        onConnect={onConnect}
        connectDisabled={currentUserId === odyssey.uuid || alreadyConnected}
        onCoCreate={() => {}}
        coCreateDisabled={true}
      />
    </Dialog>
  );
};

export default observer(OdysseyWidget);
