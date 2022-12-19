import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Heading, SvgButton} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import {OdysseyItemInterface} from 'scenes/explore/stores';
import {OdysseyInfo} from 'ui-kit/molecules/OdysseyInfo';

import * as styled from './SelectedOdyssey.styled';

interface PropsInterface {
  odyssey: OdysseyItemInterface;
  alreadyConnected: boolean;
  onTeleport: () => void;
  onConnect: (() => void) | undefined;
  onDock: () => void;
  onClose: () => void;
}

const SelectedOdyssey: FC<PropsInterface> = (props) => {
  const {odyssey, alreadyConnected, onTeleport, onDock, onConnect, onClose} = props;

  return (
    <Box size="wide" data-testid="SelectedOdyssey-test">
      <styled.Header>
        <Heading type="h1" label={odyssey.name} transform="uppercase" isTruncate />
        <SvgButton iconName="close" size="normal" onClick={onClose} />
      </styled.Header>
      <OdysseyInfo
        odyssey={odyssey}
        onVisit={onTeleport}
        onConnect={onConnect || (() => {})}
        connectDisabled={!onConnect || alreadyConnected}
        onDock={onDock}
        dockDisabled={true}
      />
    </Box>
  );
};

export default observer(SelectedOdyssey);
